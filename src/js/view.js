import onChange from 'on-change';

const renderBorder = (isValid, elements) => {
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

const renderFeedbackField = (error, elements, i18nextInstance) => {
  elements.feedbackField.textContent = i18nextInstance.t(`${error}`);
};

const renderForm = (value, elements, form) => {
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

const renderFeeds = (value, elements, i18nextInstance, newFeed = []) => {
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

const addTextSecondary = (watchedPostsId, a) => {
  watchedPostsId.forEach((id) => {
    if (a.dataset.id === id) {
      a.classList.add('text-secondary');
    }
  });
};

const renderPosts = (values, elements, i18nextInstance, watchedPostsId, newPosts = []) => {
  values.forEach((value) => {
    const a = document.createElement('a');
    a.href = value.link;
    a.textContent = value.title;
    a.classList.add('fw-bold');
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.dataset.id = value.id;

    addTextSecondary(watchedPostsId, a);

    const button = document.createElement('button');
    button.textContent = i18nextInstance.t('texts.rssLists.watches');
    button.classList.add('btn', 'btn-outline-primary', '.btn-primary', 'btn-sm');
    button.type = 'button';
    button.setAttribute('data-id', value.id);
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');

    const liPosts = document.createElement('li');
    liPosts.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0',
    );
    [a, button].forEach((item) => liPosts.append(item));
    newPosts.push(liPosts);

    const ulPosts = document.createElement('ul');
    ulPosts.classList.add('list-group', 'border-0', 'rounded-0');
    ulPosts.replaceChildren(...newPosts);

    const h2Posts = document.createElement('h2');
    h2Posts.classList.add('card-title', 'h4');
    h2Posts.textContent = i18nextInstance.t('texts.rssLists.posts');
    const divCardBodyPosts = document.createElement('div');
    divCardBodyPosts.classList.add('card-body');
    divCardBodyPosts.replaceChildren(h2Posts);

    const divCardBorderPosts = document.createElement('div');
    divCardBorderPosts.classList.add('card', 'border-0');
    [divCardBodyPosts, ulPosts].forEach((item) => {
      divCardBorderPosts.append(item);
    });

    elements.postsField.textContent = '';
    elements.postsField.append(divCardBorderPosts);
  });
};

const openModal = (title, description, link, elements) => {
  const modalTitle = elements.modal.querySelector('.modal-title');
  const modalBody = elements.modal.querySelector('.modal-body');
  const fullArticleLink = elements.modal.querySelector('.full-article');

  modalTitle.textContent = title;
  modalBody.textContent = description;
  fullArticleLink.setAttribute('href', link);
};

const renderButtonsAndModal = (postId, elements, posts) => {
  const targetContent = posts.find((item) => item.id === postId);
  const { title, description, link } = targetContent ?? {};
  openModal(title, description, link, elements);
};

const renderViewed = (watchedPostsId) => {
  const links = document.querySelectorAll('.fw-bold');
  links.forEach((a) => {
    addTextSecondary(watchedPostsId, a);
  });
};

const watch = (state, elements, i18nextInstance) => {
  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'form.isValid':
        renderBorder(value, elements);
        break;
      case 'form.error':
        renderFeedbackField(value, elements, i18nextInstance);
        break;
      case 'form.status':
        renderForm(value, elements, watchedState.form);
        break;
      case 'feeds':
        renderFeeds(value, elements, i18nextInstance);
        break;
      case 'postIdInModal':
        renderButtonsAndModal(value, elements, watchedState.posts);
        break;
      case 'ui.watchedPostsId':
        renderViewed(value);
        break;
      case 'posts':
        renderPosts(value, elements, i18nextInstance, watchedState.ui.watchedPostsId);
        break;
      default:
        throw new Error('Unknown state!');
    }
  });

  return watchedState;
};

export default watch;
