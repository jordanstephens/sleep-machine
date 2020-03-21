import React from 'react';
import './App.css'
import SleepMachine from './components/SleepMachine';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Zzz Machine</h1>
      </header>
      <main className="App-main">
        <SleepMachine />
      </main>
    </div>
  );
}

export default App;
