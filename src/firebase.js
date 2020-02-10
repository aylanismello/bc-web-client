import firebase from 'firebase';
const config = {
  apiKey: 'AIzaSyCM9RE3HEAwwjb3zVWrlWhVZ_LhRxE1R8Y',
  authDomain: 'burncartel-6b300.firebaseapp.com',
  databaseURL: 'https://burncartel-6b300.firebaseio.com',
  projectId: 'burncartel-6b300',
  storageBucket: 'burncartel-6b300.appspot.com',
  messagingSenderId: '1064392138996',
  appId: '1:1064392138996:web:f2be72f953027affa2fea1'
};
firebase.initializeApp(config);

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export default firebase;
