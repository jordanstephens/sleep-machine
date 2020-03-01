import React from 'react';

type MousePosition = { x: number, y: number };
type DragOrigin = { id: string } & MousePosition;
export type DragEvent = {
  id: string;
  origin: MousePosition;
  destination: MousePosition;
  delta: MousePosition;
  committed: boolean;
}

interface IDraggableContext {
  setOrigin: (origin: DragOrigin | null) => void;
  origin: MousePosition | null;
}
const DraggableContext = React.createContext<IDraggableContext | null>(null);

interface IDraggableProps {
  id: string;
  children: React.ReactNode;
}

export const Draggable: React.FC<IDraggableProps> = ({ id, children }) => {
  return (
    <DraggableContext.Consumer>
      {(context) => {
        if (!context) throw new Error('Invariant violation: DraggableContext.Consumer rendered without a context');
        function handleMouseDown(event: React.MouseEvent) {
          const { clientX: x, clientY: y } = event;
          context!.setOrigin({ id, x, y });
        }
        return (
          <g onMouseDown={handleMouseDown}>
            {children}
          </g>
        )
      }}
    </DraggableContext.Consumer>
  );
}

interface IDraggableProviderProps {
  onDrag: (event: DragEvent) => void;
  children: React.ReactNode;
}

interface IDraggableProviderState {
  origin: DragOrigin | null;
}

export class DraggableProvider extends React.Component<IDraggableProviderProps, IDraggableProviderState> {
  constructor(props: IDraggableProviderProps) {
    super(props);
    this.state = {
      origin: null
    };
  }

  componentDidMount() {
    document.addEventListener('mouseup', this.onMouseUp);
    document.addEventListener('mousemove', this.onMouseMove);
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('mousemove', this.onMouseMove);
  }

  onMouseMove = (event: MouseEvent) => {
    this.handleDrag(false, event);
  }

  onMouseUp = (event: MouseEvent) => {
    this.handleDrag(true, event);
  }

  handleDrag = (committed: boolean, event: MouseEvent) => {
    const { origin } = this.state;
    if (!origin) return
    const { id } = origin;
    const destination = { x: event.clientX, y: event.clientY };
    const delta = {
      x: destination.x - origin.x,
      y: destination.y - origin.y
    };
    this.props.onDrag({ id, origin, delta, destination, committed });
    if (committed) {
      this.setState({ origin: null });
    }
  }

  render() {
    const { children } = this.props;
    const { origin } = this.state;
    const setOrigin = (origin: DragOrigin | null) => this.setState({ origin });
    return (
      <DraggableContext.Provider value={{ origin, setOrigin }}>
        {children}
      </DraggableContext.Provider>
    );
  }
}
