window.onload = () => {
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAJfsgV-QsD2EevR1q_zLQOMS4t9uG9h8o",
    authDomain: "chat-app-c172b.firebaseapp.com",
    databaseURL: "https://chat-app-c172b.firebaseio.com",
    projectId: "chat-app-c172b",
    storageBucket: "chat-app-c172b.appspot.com",
    messagingSenderId: "509283146756",
    appId: "1:509283146756:web:8935dc8d2cf4f03128e951",
    measurementId: "G-0N8BGM2R36"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // show welcomeScreen
 view.setActiveScreen('loginPage');
};