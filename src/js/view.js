import onChange from 'on-change';
import { renderBorder, renderFeedbackField, renderForm } from './render.js';

const watch = (state, elements, i18nextInstance) => {
  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'form.isValid':
        renderBorder(value, elements);
        break;
      case 'form.error':
        renderFeedbackField(value, elements, i18nextInstance);
        break;
      case 'form.status':
        renderForm(value, elements, watchedState.form);
        break;
      default:
        throw new Error('Unknown state!');
    }
  });

  return watchedState;
};

export default watch;
