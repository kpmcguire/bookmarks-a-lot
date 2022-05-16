import React, { Component } from "react";
import firebase from "../Firebase";
import {navigate} from "@reach/router"
import FileUploader from 'react-firebase-file-uploader'

class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      owner: "",
      isPublic: "",
      name: "",
      notes: "",
      rating: "",
      url: "",
      thumbnail: ""
    };
  }

  componentDidMount() {
    let docRef = firebase
      .firestore()
      .collection("bookmarks")
      .doc(this.props.id);

    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          // const bookmark = doc.data();
          const { id, owner, isPublic, name, notes, rating, url, thumbnail } = doc.data();

          this.setState({
            key: id,
            name: name,
            owner: owner, 
            isPublic: isPublic,
            notes: notes,
            rating: rating, 
            url: url, 
            thumbnail: thumbnail
          });
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch(function(error) {
        console.log("Error getting document:", error);
      });
  }

  onChange = e => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState({ bookmark: state });
  };

  onSubmit = e => {
    e.preventDefault();

    const { owner, isPublic, name, notes, rating, url, thumbnail } = this.state;

    let updateRef = firebase
      .firestore()
      .collection("bookmarks")
      .doc(this.props.id);
    updateRef
      .set({
        owner,
        isPublic,
        name,
        notes,
        rating,
        url,
        thumbnail
      })
      .then(docRef => {
        this.setState({
          owner: '',
          isPublic: '',
          name: '',
          notes: '',
          rating: '',
          url: '',
          thumbnail: ''
        });
        navigate(`/show/${this.props.id}`)

      })
      .catch(error => {
        console.error("Error adding document: ", error);
      });
  };

  handleUploadStart = () => this.setState({ isUploading: true, progress: 0 });
  handleProgress = progress => this.setState({ progress });
  handleUploadError = error => {
    this.setState({ isUploading: false });
    console.error(error);
  };
  handleUploadSuccess = filename => {
    this.setState({ avatar: filename, progress: 100, isUploading: false });
    firebase
      .storage()
      .ref("images")
      .child(filename)
      .getDownloadURL()
      .then(url => this.setState({ thumbnail: url }));
  };    

  render() {
    const { owner, isPublic, name, notes, rating, url, thumbnail } = this.state;

    return (
      <div>
        <h1 className="text-xl font-bold">Editing {name}</h1>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label
              htmlFor="name"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Name
            </label>
            <input
              type="text"
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-3"
              name="name"
              id="name"
              value={name}
              onChange={this.onChange}
            />
          </div>
          <div className="form-group">
            <label
              htmlFor="url"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              URL:
            </label>
            <input
              type="text"
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-3"
              name="url"
              id="url"
              value={url}
              onChange={this.onChange}
            />
          </div>
          <div className="form-group">
            <label
              htmlFor="notes"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Notes:
            </label>
            <textarea
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-3"
              name="notes"
              id="notes"
              onChange={this.onChange}
              value={notes}
            ></textarea>
          </div>
          <div className="form-group">
            <label
              htmlFor="rating"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Rating:
            </label>
            <input
              type="text"
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-3"
              name="rating"
              id="rating"
              value={rating}
              onChange={this.onChange}
            />
          </div>

          <label className="block text-gray-700 text-sm font-bold mb-2">
            Public
            <input
              type="radio"
              name="isPublic"
              value="true"
              onChange={this.onChange}
              checked={isPublic === "true"}
              className="ml-2"
            />
          </label>

          <label className="block text-gray-700 text-sm font-bold mb-2">
            Private
            <input
              type="radio"
              name="isPublic"
              value="false"
              checked={isPublic === "false"}
              onChange={this.onChange}
              className="ml-2"
            />
          </label>

          <div className="my-2">
            <p className="block text-gray-700 text-sm font-bold mb-2">
              Thumbnail:
            </p>
            <img alt="" src={thumbnail} width="100"></img>
          </div>
          <FileUploader
            accept="image/*"
            name="thumbnail"
            randomizeFilename
            storageRef={firebase.storage().ref("images")}
            onUploadStart={this.handleUploadStart}
            onUploadError={this.handleUploadError}
            onUploadSuccess={this.handleUploadSuccess}
            onProgress={this.handleProgress}
          />
          <div>
            <button
              type="submit"
              className="block bg-blue-700 hover:bg-blue-900 active:bg-blue-500 text-white font-bold py-2 px-4 rounded my-2 inline-block"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default Edit;
