import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/custom.css';
import * as yup from 'yup';
import i18next from 'i18next';
import _ from 'lodash';
import watch from './view.js';
import ru from '../locales/index.js';
import yupLocales from '../locales/yupLocales.js';
import getDataFromUrl from './getDataFromUrl.js';
import parseRssContent from './parsers.js';

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
    postsField: document.querySelector('.posts'),
    modal: document.querySelector('#modal'),
    modalTitle: document.querySelector('.modal-title'),
    modalBody: document.querySelector('.modal-body'),
  };

  const validate = (url, arrayOfUrls) => {
    const schema = yup.string().url().notOneOf(arrayOfUrls);
    return schema.validate(url);
  };

  const updatePosts = (watchedState) => {
    const update = () => {
      const updatedPosts = watchedState.feeds.map((feed) => getDataFromUrl(feed.link)
        .then((response) => {
          const { resultPosts } = parseRssContent(response, feed.link);

          const newPosts = resultPosts.filter(
            (post) => !watchedState.posts
              .some((statePost) => statePost.link === post.link),
          )
            .map((post) => ({ ...post, id: _.uniqueId() }));

          watchedState.posts = [...newPosts, ...watchedState.posts];
        })
        .catch((e) => {
          console.log(e);
        }));

      Promise.all(updatedPosts).then(() => setTimeout(update, 5000));
    };

    update();
  };

  const webError = (watchedState) => {
    watchedState.form.isValid = false;
    watchedState.form.error = 'texts.statusMessage.webError';
    watchedState.form.status = 'fail';
  };

  const novalidRssError = (watchedState) => {
    watchedState.form.isValid = false;
    watchedState.form.status = 'fail';
    watchedState.form.error = 'texts.statusMessage.noValidRss';
  };

  const errorCatching = (e, watchedState) => {
    if (e.isParsingError) {
      novalidRssError(watchedState);
    } else {
      webError(watchedState);
    }
  };

  const createElements = (url, watchedState) => {
    getDataFromUrl(url)
      .then((response) => {
        const {
          titleRSS, descriptionRSS, link, resultPosts,
        } = parseRssContent(response, url);

        watchedState.form.status = 'success';
        watchedState.form.error = 'texts.statusMessage.successful';
        watchedState.feeds.unshift({ titleRSS, descriptionRSS, link });

        const posts = resultPosts.map((post) => ({ ...post, id: _.uniqueId() }));
        watchedState.posts = [...posts, ...watchedState.posts];
      })
      .catch((e) => {
        errorCatching(e, watchedState);
      });
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
      updatePosts(watchedState);

      elements.postsField.addEventListener('click', (eViewed) => {
        if (eViewed.target.tagName.toUpperCase() === 'BUTTON' || eViewed.target.tagName.toUpperCase() === 'A') {
          const currentId = eViewed.target.dataset.id;
          watchedState.ui.watchedPostsId.add(currentId);
          watchedState.postIdInModal = currentId;
        }
      });

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
