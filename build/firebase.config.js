"use strict";
exports.__esModule = true;
// Import the functions you need from the SDKs you need
var app_1 = require("firebase/app");
var analytics_1 = require("firebase/analytics");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyClw38dA9Jnox87q5EUkbnIeVmS23EXk9w",
    authDomain: "next-blog-ee80a.firebaseapp.com",
    projectId: "next-blog-ee80a",
    storageBucket: "next-blog-ee80a.appspot.com",
    messagingSenderId: "914605909005",
    appId: "1:914605909005:web:537b8a5694d927805b2144",
    measurementId: "G-MNCQ4437NM"
};
// Initialize Firebase
var app = (0, app_1.initializeApp)(firebaseConfig);
var analytics = (0, analytics_1.getAnalytics)(app);
