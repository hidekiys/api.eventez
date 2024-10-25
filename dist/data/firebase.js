"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = void 0;
// Import the functions you need from the SDKs you need
var app_1 = require("firebase/app");
var storage_1 = require("firebase/storage");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyAc5R2nGuIhjEmkbZ8WGbf1FcfJ7hnMQf4",
    authDomain: "eventez-uploads.firebaseapp.com",
    projectId: "eventez-uploads",
    storageBucket: "eventez-uploads.appspot.com",
    messagingSenderId: "417305230500",
    appId: "1:417305230500:web:6f4a6196a9aaab2fcb7a31",
    measurementId: "G-8QC6S95LSE"
};
// Initialize Firebase
var firebaseApp = (0, app_1.initializeApp)(firebaseConfig);
exports.storage = (0, storage_1.getStorage)(firebaseApp);
