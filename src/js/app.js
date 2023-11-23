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
      isValid: false,
      error: null,
      status: 'success',
    },
    feeds: [],
    posts: [],
    ui: {
      watchedPostsId: new Set(),
    },
    modal: {
      postId: null,
    },
  };

  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    feedbackField: document.querySelector('.feedback'),
    submitButton: document.querySelector('[type=submit]'),
    feedField: document.querySelector('.feeds'),
    postsField: document.querySelector('.posts'),
    modal: document.getElementById('modal'),
  };

  const validate = (url, arrayOfUrls) => {
    const schema = yup.string().url().notOneOf(arrayOfUrls);
    return schema.validate(url);
  };

  const updatePosts = (watchedState) => {
    const update = () => {
      const delayForUpdateFunc = 5000;
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
          // eslint-disable-next-line no-console
          console.log(e);
        }));

      Promise.all(updatedPosts).then(() => setTimeout(update, delayForUpdateFunc));
    };

    update();
  };

  const setWebError = (watchedState) => {
    watchedState.form.isValid = false;
    watchedState.form.error = 'texts.statusMessage.webError';
    watchedState.form.status = 'fail';
  };

  const setNovalidRssError = (watchedState) => {
    watchedState.form.isValid = false;
    watchedState.form.status = 'fail';
    watchedState.form.error = 'texts.statusMessage.noValidRss';
  };

  const errorCatching = (e, watchedState) => {
    if (e.isParsingError) {
      setNovalidRssError(watchedState);
    } else {
      setWebError(watchedState);
    }
  };

  const createElements = (url, watchedState) => {
    getDataFromUrl(url)
      .then((response) => {
        const {
          titleRSS, descriptionRSS, resultPosts,
        } = parseRssContent(response);

        watchedState.form.status = 'success';
        watchedState.form.error = 'texts.statusMessage.successful';
        watchedState.feeds.unshift({ titleRSS, descriptionRSS, link: url });

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

      elements.modal.addEventListener('show.bs.modal', (e) => {
        const button = e.relatedTarget;
        const recipientId = button.getAttribute('data-id');
        watchedState.ui.watchedPostsId.add(recipientId);
        watchedState.modal.postId = recipientId;
      });

      elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        watchedState.form.status = 'loading';
        const formData = new FormData(e.target);
        const url = formData.get('url');
        const arrayOfUrls = watchedState.feeds.map((feed) => feed.link);
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
