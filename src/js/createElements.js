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

const createElements = (url, watchedState) => {
  getDataFromUrl(url)
    .then((response) => {
      const {
        titleRSS, descriptionRSS, link, resultPosts,
      } = parseRssContent(response, url);

      watchedState.form.status = 'success';
      watchedState.form.error = 'texts.statusMessage.successful';
    })
    .catch((e) => {
      errorCatching(e, watchedState);
    });
};

export default createElements;
