import getDataFromUrl from './getDataFromUrl.js';
import parseRssContent from './parsers.js';

const createElements = (url, watchedState) => {
  getDataFromUrl(url)
    .then((response) => {
      const {
        titleRSS, descriptionRSS, link, resultPosts,
      } = parseRssContent(response, url);

      watchedState.form.error = 'texts.statusMessage.successful';

      console.log(titleRSS, descriptionRSS, link, resultPosts);
    })
    .catch((e) => {
      console.log(e);
    });
};

export default createElements;
