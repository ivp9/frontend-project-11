import axios from 'axios';

const getStringUrl = (url) => {
  const allOriginsHexletUrl = new URL('https://allorigins.hexlet.app/get');
  allOriginsHexletUrl.searchParams.set('disableCashe', 'true');
  allOriginsHexletUrl.searchParams.set('url', url);
  return allOriginsHexletUrl.toString();
};

const getDatafromUrl = (url) => {
  axios.get(getStringUrl(url), { timeout: 45000 })
    .then((response) => response.data);
};

export default getDatafromUrl;
