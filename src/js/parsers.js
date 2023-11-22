const parseRssContent = (response) => {
  const parser = new DOMParser();
  const parsedResponse = parser.parseFromString(response, 'application/xml');

  const parseErrorNode = parsedResponse.querySelector('parsererror');
  if (parseErrorNode) {
    parseErrorNode.isParsingError = true;
    throw parseErrorNode;
  }

  const titleRSS = parsedResponse.querySelector('title').textContent;
  const descriptionRSS = parsedResponse.querySelector('description').textContent;

  const items = parsedResponse.querySelectorAll('item');
  const resultPosts = Array.from(items).map((item) => {
    const link = item.querySelector('link').textContent;
    const title = item.querySelector('title').textContent;
    const description = item.querySelector('description').textContent;
    return { title, description, link };
  });

  return {
    titleRSS, descriptionRSS, link: '', resultPosts,
  };
};

export default parseRssContent;
