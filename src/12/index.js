import { createMachine, assign, interpret } from 'xstate';

const elBox = document.getElementById('box');
const cancelButton = document.getElementById("cancel")

const randomFetch = () => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      if (Math.random() < 0.5) {
        rej('Fetch failed!');
      } else {
        res('Fetch succeeded!');
      }
    }, 2000);
  });
};

const machine = createMachine({
  initial: 'idle',
  context: {
    text: '',
  },
  states: {
    idle: {
      on: {
        FETCH: 'pending',
      },
    },
    pending: {
      on: {
        CANCEL: 'idle',
      },
      invoke: {
        // Invoke your promise here.
        // The `src` should be a function that returns the source.
        src: (context, event) => randomFetch(),
        onDone: {
          target: 'resolved',
          actions: assign({
            text: (context, event) => event.data
          }),
        },
        onError: {
          target: 'rejected',
          actions: assign({
            text: (context, event) => event.data
          }),
        },
      },
    },
    resolved: {
      // Add a transition to fetch again
      on: {
        FETCH: 'pending',
      },
    },
    rejected: {
      // Add a transition to fetch again
      on: {
        FETCH: 'pending',
      },
    },
  },
});

const service = interpret(machine);

service.onTransition((state) => {
  elBox.dataset.state = state.toStrings().join(' ');
  elBox.dataset.text = state.context.text;
  console.log(state);
});

service.start();

elBox.addEventListener('click', (event) => {
  service.send('FETCH');
});

cancelButton.addEventListener('click', (event) => {
  service.send('CANCEL');
});