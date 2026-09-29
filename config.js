 // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-analytics.js";
  import { getFirestore } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyDPIq09bS4zX10qY2wmRlnnuSy3u_TkyQ0",
    authDomain: "local-tourism-jo.firebaseapp.com",
    databaseURL: "https://local-tourism-jo-default-rtdb.firebaseio.com",
    projectId: "local-tourism-jo",
    storageBucket: "local-tourism-jo.firebasestorage.app",
    messagingSenderId: "468515668676",
    appId: "1:468515668676:web:ddde9c6b7351462cccbf91",
    measurementId: "G-L1M06Y5S90"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const database = getFirestore(app);
  export { app, analytics, database };