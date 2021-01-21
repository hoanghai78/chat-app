const controller = {};

const emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

controller.validateLoginInfo = (email, password) => {
  if (!email) {
    view.renderErrorMessage('email-error-message', 'Please input email');
  } else if (!emailRegex.test(email)) {
    view.renderErrorMessage('email-error-message', 'Invalid email address');
  } else {
    view.renderErrorMessage('email-error-message', '');
  }

  if (!password) {
    view.renderErrorMessage('password-error-message', 'Please input password')
  } else {
    view.renderErrorMessage('password-error-message', '')
  }

  // check database
  if (email && password) {
    // call model => check database
    model.loginUser(email, password);
  }
};

controller.validateRegisterInfo = (
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
) => {
  // firstName
  if (!firstName) {
    view.renderErrorMessage('first-name-error-message', 'Please input first name');
  } else {
    view.renderErrorMessage('first-name-error-message', '');
  }

  // lastName
  if (!lastName) {
    view.renderErrorMessage('last-name-error-message', 'Please input last name');
  } else {
    view.renderErrorMessage('last-name-error-message', '');
  }

  // email
  if (!email) {
    view.renderErrorMessage('email-error-message', 'Please input email');
  } else if (!emailRegex.test(email)) {
    view.renderErrorMessage('email-error-message', 'Invalid email address');
  } else {
    view.renderErrorMessage('email-error-message', '');
  }

  // password
  if (!password) {
    view.renderErrorMessage('password-error-message', 'Please input password');
  } else {
    view.renderErrorMessage('password-error-message', '');
  }

  // confirmPassword
  if (!confirmPassword) {
    view.renderErrorMessage('confirm-password-error-message', 'Please confirm password');
  } else if (confirmPassword !== password) {
    view.renderErrorMessage('confirm-password-error-message', 'Confirm password didnt match');
  } else {
    view.renderErrorMessage('confirm-password-error-message', '');
  }

  if (firstName && lastName && email && emailRegex.test(email) && password && confirmPassword === password) {
    model.createNewUser(
      firstName,
      lastName,
      email,
      password,
    );
  }
};

controller.validateConversationInfo = (conversationName, userEmail) => {
  if (!conversationName) {
    view.renderErrorMessage(
      'conversation-name-error-message',
      `Please input conversation name`,
    );
  } else {
    view.renderErrorMessage(
      'conversation-name-error-message',
      '',
    );
  }

  if (!userEmail) {
    view.renderErrorMessage(
      'user-email-error-message',
      'Please input email address',
    );
  } else if (!emailRegex.test(userEmail)) {
    view.renderErrorMessage(
      'user-email-error-message',
      'Invalid email address',
    );
  } else if (userEmail === model.loginUser.email) {
    view.renderErrorMessage(
      'user-email-error-message',
      'You cant input your own email',
    );
  } else {
    view.renderErrorMessage(
      'user-email-error-message',
      '',
    );
  }

  if (conversationName && userEmail && emailRegex.test(userEmail) && userEmail !== model.loginUser.email) {
    // call model
    model.createConversation(conversationName, userEmail);
  }
};