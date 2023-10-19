import onChange from 'on-change';
import {
  renderBorder, renderFeedbackField, renderForm, renderFeeds,
  renderPosts, renderViewed, renderButtonsAndModal,
} from './render.js';

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
      case 'feeds':
        renderFeeds(value, elements, i18nextInstance);
        break;
      case 'postIdInModal':
        renderButtonsAndModal(value, elements, watchedState.posts);
        break;
      case 'ui.watchedPostsId':
        renderViewed(value);
        break;
      case 'posts':
        renderPosts(value, elements, i18nextInstance, watchedState.ui.watchedPostsId);
        break;
      default:
        throw new Error('Unknown state!');
    }
  });

  return watchedState;
};

export default watch;
