import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/custom.css';
import * as yup from 'yup';
import i18next from 'i18next';
import watch from './view.js';
import ru from '../locales/index.js';
import yupLocales from '../locales/yupLocales.js';
import createElements from './createElements.js';

export default () => {
  const state = {
    form: {
      isValid: null,
      error: null,
      status: null,
    },
    feeds: [],
    posts: [],
    feedsAndPosts: {
      currentIdAndButton: {},
    },
    ui: {
      watchedPostsId: new Set(),
    },
    postIdInModal: '',
  };

  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    feedbackField: document.querySelector('.feedback'),
    submitButton: document.querySelector('[type=submit]'),
    feedField: document.querySelector('.feeds'),
  };

  const validate = (url, arrayOfUrls) => {
    const schema = yup.string().url().notOneOf(arrayOfUrls);
    return schema.validate(url);
  };

  const defaultLanguage = 'ru';
  const i18nextInstance = i18next.createInstance();
  i18nextInstance
    .init({
      lng: defaultLanguage,
      debug: false,
      resources: { ru },
    })
    .then(() => {
      yup.setLocale(yupLocales);
      const watchedState = watch(state, elements, i18nextInstance);

      elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        watchedState.form.status = 'loading';
        const formData = new FormData(e.target);
        const url = formData.get('url');
        const arrayOfUrls = watchedState.feeds;
        validate(url, arrayOfUrls)
          .then(() => {
            watchedState.form.isValid = true;
            createElements(url, watchedState);
          })
          .catch((error) => {
            watchedState.form.isValid = false;
            watchedState.form.status = 'fail';
            watchedState.form.error = error.message;
          });
      });
    });
};
