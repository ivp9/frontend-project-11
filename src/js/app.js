import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/custom.css';
import * as yup from 'yup';
import i18next from 'i18next';
import watch from './view.js';
import resources from '../locales/index.js';
import yupLocales from '../locales/yupLocales.js';

export default () => {
  const state = {
    form: {
      isValid: true,
      error: null,
    },
    feeds: [],
    posts: [],
  };

  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    feedbackField: document.querySelector('.feedback'),
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
      resources,
    })
    .then(() => {
      yup.setLocale(yupLocales);

      const watchedState = watch(state, elements);

      elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const url = formData.get('url');
        const arrayOfUrls = watchedState.feeds;
        validate(url, arrayOfUrls)
          .then(() => {
            watchedState.form.isValid = true;
          })
          .catch((error) => {
            watchedState.form.isValid = false;
            watchedState.form.error = error.message;
          });
      });
    });
};
