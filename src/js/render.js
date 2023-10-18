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
