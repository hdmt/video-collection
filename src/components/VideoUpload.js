import React, { Component } from 'react';
import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';
import _ from 'lodash';

class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = { video: null }
  }

  handleChange = event => {
    event.preventDefault();
    const video = event.target.files[0];

    this.setState({ video });
  }

  handleSubmit = event => {
    event.preventDefault();

    this.fileUpload(this.state.video);
  }

  saveVideoMetadata(metadata) {
    const userUid = firebase.auth().currentUser.uid;
    const videoRef = firebase.firestore()
                      .doc(`users/${userUid}`)
                      .collection('videos').doc();
    metadata = Object.assign(metadata, {uid: videoRef.id});

    await videoRef.set(metadata, {merge: true});
  }

  async fileUpload(video) {
    try {
      const filePath = `videos/${firebase.auth().currentUser.uid}/${video.name}`;
      const videoStorageRef = firebase.storage().ref(filePath);
      const idToken = await firebase.auth().currentUser.getIdToken(true);
      const metadataForStorage = {
        customMetadata: {
          idToken: idToken
        }
      };
      const fileSnapshot = await videoStorageRef.put(video,metadataForStorage);

      if (video.type === 'video/mp4') {
        const downloadURL = await videoStorageRef.getDownloadURL();
        let metadataForStorage = _.omitBy(fileSnapshot.metadata, _.isEmpty);
        metadataForStorage = Object.assign(metadataForStorage, {downloadURL:downloadURL});

        this.saveVideoMetadata(metadataForStorage);
      }
      console.log(fileSnapshot);
    } catch(error) {
      console.log(error);

      return;
    }
  }

  render() {
    return (
      <form onSubmit={e => this.handleSubmit(e)}>
        <h2>Video Upload</h2>
        <input
          type="file"
          accept="video/*"
          onChange={e => this.handleChange(e)}
        />
        <button type="submit">Upload Video</button>
      </form>
    );
  }
}

export default Upload;