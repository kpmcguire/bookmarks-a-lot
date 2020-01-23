import * as firebase from "firebase";

const config = {
    apiKey: "AIzaSyA49FU4ZUUsec43G0ASfYSVZiPYnpK-u58",
    authDomain: "test-react-crud-bc76d.firebaseapp.com",
    databaseURL: "https://test-react-crud-bc76d.firebaseio.com",
    projectId: "test-react-crud-bc76d",
    storageBucket: "test-react-crud-bc76d.appspot.com",
    messagingSenderId: "56042558557",
    appId: "1:56042558557:web:2cda2ab0d5529b0c8ea9b4"
};
firebase.initializeApp(config);


export default firebase;
