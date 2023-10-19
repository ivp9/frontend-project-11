export const renderBorder = (isValid, elements) => {
  if (isValid === false) {
    elements.input.classList.add('is-invalid');
    elements.feedbackField.classList.remove('text-success');
    elements.feedbackField.classList.add('text-danger');
  } else if (isValid === true) {
    elements.input.classList.remove('is-invalid');
    elements.feedbackField.classList.remove('text-danger');
    elements.feedbackField.classList.add('text-success');
  }
};

export const renderFeedbackField = (error, elements, i18nextInstance) => {
  elements.feedbackField.textContent = i18nextInstance.t(`${error}`);
};

export const renderForm = (value, elements, form) => {
  if (value === 'loading') {
    elements.submitButton.disabled = true;
    elements.feedbackField.textContent = '';
    form.isValid = false;
  } else if (value === 'success') {
    elements.submitButton.disabled = false;
    elements.form.reset();
    elements.input.focus();
  } else if (value === 'fail') {
    elements.submitButton.disabled = false;
  }
};

export const renderFeeds = (value, elements, i18nextInstance, newFeed = []) => {
  value.forEach((element) => {
    const h3Feed = document.createElement('h3');
    h3Feed.classList.add('h6', 'm-0');
    h3Feed.textContent = element.titleRSS;

    const pFeed = document.createElement('p');
    pFeed.classList.add('m-0', 'small', 'text-black-50');
    pFeed.textContent = element.descriptionRSS;

    const liFeed = document.createElement('li');
    liFeed.classList.add('list-group-item', 'border-0', 'border-end-0');

    [h3Feed, pFeed].forEach((el) => {
      liFeed.append(el);

      newFeed.push(liFeed);
    });
  });

  const ulFeed = document.createElement('ul');
  ulFeed.classList.add('list-group', 'border-0', 'border-end-0');
  ulFeed.replaceChildren(...newFeed);

  const h2Feed = document.createElement('h2');
  h2Feed.classList.add('card-title', 'h4');
  h2Feed.textContent = i18nextInstance.t('texts.rssLists.feeds');

  const divCardBody = document.createElement('div');
  divCardBody.classList.add('card-body');
  divCardBody.replaceChildren(h2Feed);

  const divCardBorder = document.createElement('div');
  divCardBorder.classList.add('card', 'border-0');
  [divCardBody, ulFeed].forEach((el) => {
    divCardBorder.append(el);
  });

  elements.feedField.innerHTML = '';
  elements.feedField.append(divCardBorder);
};

export const renderPosts = () => {};

export const renderButtonsAndModal = () => {};

export const renderViewed = () => {};
