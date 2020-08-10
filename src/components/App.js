import React , { Component } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import config from '../config/firebase-config';
import Header from './Header';

class App extends Component {
  constructor() {
    super();

    // init firebase
    firebase.initializeApp(config);
  }

  render() {
    return (
      <Header />
    );
  }
}

export default App;
