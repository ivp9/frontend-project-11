import _ from 'lodash';
import getDataFromUrl from './getDataFromUrl.js';
import parseRssContent from './parsers.js';

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

export const updatePosts = (watchedState) => {
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

export const createElements = (url, watchedState) => {
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
