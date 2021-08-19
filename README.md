# Sleep Machine

A generative arpeggiator based on a first-order Markov Chain with initial weights derived from pop music. Might put you to sleep. 😴

This project uses [Vose's "Alias method"](https://www.keithschwarz.com/darts-dice-coins/) to sample a discrete probability distribution where each value in the distribution represents a musical scale tone (∈ {0,1,2,3,4,5,6,7}). The weight of each value in the distribution represents the probability of that scale tone being chosen as the root of the subsequent arpeggiation step. The actual chord is derived from the scale tone within the [Ionian mode](https://en.wikipedia.org/wiki/Ionian_mode). Tones from this chord are then randomly selected across five octaves within a given arpeggiation step.

The initial distribution's weights are derived from this excellent series of [Hook Theory articles](https://www.hooktheory.com/blog/i-analyzed-the-chords-of-1300-popular-songs-for-patterns-this-is-what-i-found/) on common chords and chord progressions in popular music. The intention here is to stochastically generate arpeggiated music which sounds pleasant. The weights may be altered by the user however, if they wish to go their own way.
