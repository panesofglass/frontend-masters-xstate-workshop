import { createMachine, assign, interpret } from 'xstate';

const elBox = document.getElementById('box');
const elBody = document.body;

const assignPoint = assign({
  px: (context, event) => event.clientX,
  py: (context, event) => event.clientY,
});
//const assignPoint = assign((context, event) => ({ x: event.x, y: event.y }));

const assignPosition = assign({
  x: (context, event) => context.x + context.dx,
  y: (context, event) => context.y + context.dy,
  dx: 0,
  dy: 0,
  px: 0,
  py: 0,
});

const assignDelta = assign({
  dx: (context, event) => event.clientX - context.px,
  dy: (context, event) => event.clientY - context.py,
});

const showDelta = (context) => {
  elBox.dataset.delta = `delta: ${context.dx}, ${context.dy}`;
}

const resetPosition = assign({
  dx: 0,
  dy: 0,
  px: 0,
  py: 0,
});

const machine = createMachine({
  initial: 'idle',
  // Set the initial context
  // Clue: {
  //   x: 0,
  //   y: 0,
  //   dx: 0,
  //   dy: 0,
  //   px: 0,
  //   py: 0,
  // }
  context: {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    px: 0,
    py: 0,
  },
  states: {
    idle: {
      on: {
        mousedown: {
          // Assign the point
          actions: [assignPoint],
          target: 'dragging',
        },
      },
    },
    dragging: {
      on: {
        mousemove: {
          // Assign the delta
          actions: [assignDelta, showDelta],
          // (no target!)
        },
        mouseup: {
          // Assign the position
          actions: [assignPosition],
          target: 'idle',
        },
        'keyup.escape': {
          actions: resetPosition,
          target: 'idle',
        }
      },
    },
  },
});

const service = interpret(machine);

service.onTransition((state) => {
  if (state.changed) {
    console.log(state.context);

    elBox.dataset.state = state.value;

    elBox.style.setProperty('--dx', state.context.dx);
    elBox.style.setProperty('--dy', state.context.dy);
    elBox.style.setProperty('--x', state.context.x);
    elBox.style.setProperty('--y', state.context.y);
  }
});

service.start();

// Add event listeners for:
// - mousedown on elBox
// - mousemove on elBody
// - mouseup on elBody
elBox.addEventListener('mousedown', (event) => {
  service.send(event);
});

elBody.addEventListener('mousemove', (event) => {
  service.send(event);
});

elBody.addEventListener('mouseup', (event) => {
  service.send(event);
});

elBody.addEventListener('keyup', (e) => {
  if (e.key === 'Escape') {
    service.send('keyup.escape');
  }
});
