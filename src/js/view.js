import onChange from 'on-change';
import renderBorder from './render.js';

const watch = (state, elements) => {
  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'form.isValid':
        renderBorder(value, elements);
        break;
      default:
        throw new Error('Unknown state!');
    }
  });

  return watchedState;
};

export default watch;
