import { createMachine, interpret } from 'xstate';

const elBox = document.getElementById('box');

const machine = createMachine({
  initial: 'inactive',
  states: {
    inactive: {
      on: {
        MOUSEDOWN: 'active'
      }
    },
    active: {
      on: {
        MOUSEUP: 'inactive'
      }
    }
  }
});

// Create a service using interpret(...)
const service = interpret(machine);

// Listen to state transitions and set
// `elBox.dataset.state` to the state value as before.
// ...
service.onTransition((state) => {
  elBox.dataset.state = state.value;
});

// Start the service.
// ...
service.start()

elBox.addEventListener('mousedown', (event) => {
  // Send a mousedown event
  // ...
  service.send('MOUSEDOWN');
});

elBox.addEventListener('mouseup', (event) => {
  // Send a mouseup event
  // ...
  service.send('MOUSEUP');
});
