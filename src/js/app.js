import * as yup from 'yup';
import watch from './view.js';

export default () => {
  const state = {
    form: {
      isValid: true,
    },
    feeds: [],
    posts: [],
  };

  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    errorField: document.querySelector('.feedback'),
  };

  const validate = (url, arrayOfUrls) => {
    const schema = yup.string().url().notOneOf(arrayOfUrls);
    return schema.validate(url);
  };

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
      .catch(() => {
        watchedState.form.isValid = false;
      });
  });
};
