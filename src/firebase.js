import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
	apiKey: 'AIzaSyApNjFQqD1A2pkqQp7t7j7bcQNJ5bZW8mw',
	authDomain: 'my-gram-1f47e.firebaseapp.com',
	databaseURL: 'https://my-gram-1f47e.firebaseio.com',
	projectId: 'my-gram-1f47e',
	storageBucket: 'my-gram-1f47e.appspot.com',
	messagingSenderId: '581125919452',
	appId: '1:581125919452:web:6825dd06d00c6fc2761a19',
	measurementId: 'G-ZQYF2LX6TE'
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
