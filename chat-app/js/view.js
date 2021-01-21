const view = {};

view.setActiveScreen = (screenName) => {
  const app = document.getElementById('app');

  switch (screenName) {
    case 'loginPage':
      if (app) {
        app.innerHTML = components.loginPage;
      }

      // listen submit
      const loginForm = document.getElementById('login-form');
      if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const email = loginForm.email.value;
            const password = loginForm.password.value;

            controller.validateLoginInfo(email, password);
        });
      }

      // listen click
      const registerLink = document.getElementById('register-link');
      if (registerLink) {
        registerLink.addEventListener('click', (event) => {
          view.setActiveScreen('registerPage');
        });
      }
      break;
    case 'registerPage':
      if (app) {
        app.innerHTML = components.registerPage;
      }

      // listen link click
      const loginLink = document.getElementById('login-link');
      if (loginLink) {
        loginLink.addEventListener('click', (event) => {
          view.setActiveScreen('loginPage');
        });
      }

      // listen form submit
      const registerForm = document.getElementById('register-form');
      if (registerForm) {
        registerForm.addEventListener('submit', (event) => {
          event.preventDefault();

          controller.validateRegisterInfo(
            registerForm.firstName.value,
            registerForm.lastName.value,
            registerForm.email.value,
            registerForm.password.value,
            registerForm.confirmPassword.value,
          );
        });
      }
      break;
    case 'chatPage':
      if (app) {
        app.innerHTML = components.chatPage;
      }

      // listen media query
      const mediaQueryResult = window.matchMedia('only screen and (max-width: 768px)');
      mediaQueryResult.addListener((mediaQuery) => {
        if (mediaQuery.matches) {
          // render small conversation item
          view.renderSmallConversationItem();
        } else {
          // render big conversation item
          view.renderBigConversationItem();
        }
      });

      // load all conversations
      model.loadConversations();

      // list input focus
      const messageInputElement = document.getElementById('message-input');
      if (messageInputElement) {
        messageInputElement.addEventListener('focus', () => {
          view.removeNotification(model.activeConversation.id);
        });
      }

      // listen createConversation click
      const createConversationBtn = document.getElementById('create-conversation-btn');
      if (createConversationBtn) {
        createConversationBtn.addEventListener(`click`, () => {
          model.clearConversations();
          view.setActiveScreen('createConversationPage');
        });
      }

      // listen message form submit
      const messageForm = document.getElementById('message-form');
      if (messageForm) {
        messageForm.addEventListener('submit', (event) => {
          event.preventDefault();

          const messageContainer = document.getElementById('message-container');
          if (messageContainer && messageForm.message.value) {
            // save to database
            model.saveMessage(messageForm.message.value);
            
            // clear input
            messageForm.message.value = '';
          }
        });
      }
      break;
    case `createConversationPage`:
      if (app) {
        app.innerHTML = components.createConversationPage;
      }

      // listen form submit
      const createConversationForm = document.getElementById('create-conversation-form');
      if (createConversationForm) {
        createConversationForm.addEventListener('submit', (event) => {
          event.preventDefault();

          const conversationName = createConversationForm.conversationName.value;
          const userEmail = createConversationForm.userEmail.value;

          controller.validateConversationInfo(
            conversationName,
            userEmail,
          );
        });
      }

      // listen cancel click
      const cancelCreateConversationBtn = document.getElementById('cancel-create-conversation');
      if (cancelCreateConversationBtn) {
        cancelCreateConversationBtn.addEventListener('click', () => {
          view.setActiveScreen(`chatPage`);
        });
      }

      break;
  }
};

view.renderErrorMessage = (elementId, errorMessage) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerText = errorMessage;
  }
};

view.clearRegisterInfo = () => {
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.firstName.value = '';
    registerForm.lastName.value = '';
    registerForm.email.value = '';
    registerForm.password.value = '';
    registerForm.confirmPassword.value = '';
  }
};

view.sendMessage = (sender, messageContent) => {
  const messageContainer = document.getElementById('message-container');
  if (messageContainer) {
    // create 3 div element
    const messageItem = document.createElement('div');
    const senderElement = document.createElement('div');
    const messageContentElement = document.createElement('div');

    // modify div.message-item
    messageItem.classList.add('message-item');
    if (sender) {
      messageItem.classList.add('other-message');
    } else {
      messageItem.classList.add('my-message');
    }

    // modify div.sender
    senderElement.classList.add('sender');
    if (sender) {
      senderElement.innerText = sender;
    }

    // modify div.message-content
    messageContentElement.classList.add('message-content');
    messageContentElement.innerText = messageContent;

    // assemble
    messageItem.appendChild(senderElement);
    messageItem.appendChild(messageContentElement);

    // append to message-container
    messageContainer.appendChild(messageItem);

    // scroll
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }
};

view.renderConversationItem = (conversation) => {
  const conversationListContent = document.getElementById('conversation-list-content');
  if (conversationListContent) {
    const conversationItemElelement = document.createElement('div');
    const mediaQueryResult = window.matchMedia('only screen and (max-width: 768px)');
    conversationItemElelement.id = conversation.id;
    conversationItemElelement.classList.add('conversation-item');
    conversationItemElelement.setAttribute('data-conversation-name', conversation.name);
    if (mediaQueryResult.matches) {
      // first letter
      conversationItemElelement.innerText = conversation.name[0].toUpperCase();
      const createConversationButton = document.getElementById('create-conversation-btn');
      if (createConversationButton) {
        createConversationButton.innerText = '+';
      }
    } else {
      // full name
      conversationItemElelement.innerText = conversation.name;
      const createConversationButton = document.getElementById('create-conversation-btn');
      if (createConversationButton) {
        createConversationButton.innerText = '+ New Conversation';
      }
    }

    if (conversation.id === model.activeConversation.id) {    //boi den converstation dang hd
      conversationItemElelement.classList.add('active-conversation');
    }

    // listen click event
    conversationItemElelement.addEventListener('click', () => {
      let conversationInfo;
      model.conversations.forEach((item) => {
        if (item.id === conversation.id) {
          conversationInfo = item;
        }
      });

      // remove notification
      view.removeNotification(conversation.id);

      // update model.activeConversation
      model.changeActiveConversation(conversation);

      // update .active-conversation (style)
      const activeConversationElement = document.querySelector('.active-conversation');
      if (activeConversationElement) {
        activeConversationElement.classList.remove('active-conversation');
      }
      conversationItemElelement.classList.add('active-conversation');

      // update message container
      const messageContainerElement = document.getElementById('message-container');
      if (messageContainerElement) {
        messageContainerElement.innerText = '';
      }
      conversationInfo.messages.forEach((item) => {
        if (item.user === model.loginUser.email) {
          view.sendMessage('', item.content);
        } else {
          view.sendMessage(item.user, item.content);
        }
      });
    });

    conversationListContent.appendChild(conversationItemElelement);
  }
};

view.renderNotification = (conversationId) => {
  const conversationItemElement = document.getElementById(conversationId);
  if (conversationItemElement) {
    // check exist notification
    const existedNotificationElement = conversationItemElement.querySelector('.notification');
    if (!existedNotificationElement) {
      // display noti
      const notiElement = document.createElement('span');
      notiElement.classList.add('notification');

      conversationItemElement.appendChild(notiElement);
    }
  }
};

view.removeNotification = (conversationId) => {
  const conversationItemElement = document.getElementById(conversationId);
  if (conversationItemElement) {
    const existedNotificationElement = conversationItemElement.querySelector('.notification');
    if (existedNotificationElement) {
      conversationItemElement.removeChild(existedNotificationElement);
    }
  }
};

view.renderSmallConversationItem = () => {
  const conversationItemElements = document.getElementsByClassName('conversation-item');

  for (let element of conversationItemElements) {
    const conversationName = element.innerText;
    const firstLetter = conversationName[0];

    element.innerText = firstLetter.toUpperCase();
  }

  const createConversationButton = document.getElementById('create-conversation-btn');
  if (createConversationButton) {
    createConversationButton.innerText = '+';
  }
};

view.renderBigConversationItem = () => {
  const conversationItemElements = document.getElementsByClassName('conversation-item');

  for (let element of conversationItemElements) {
    const fullName = element.getAttribute('data-conversation-name');
    element.innerText = fullName;
  }

  const createConversationButton = document.getElementById('create-conversation-btn');
  if (createConversationButton) {
    createConversationButton.innerText = '+ New conversation';
  }
};