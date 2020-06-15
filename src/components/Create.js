import React, { Component } from "react";
import firebase from "../Firebase";
import {navigate} from "@reach/router"
// import Form from './form'
// import FileUploader from 'react-firebase-file-uploader'
import {FaSpinner} from 'react-icons/fa'


class Create extends Component {
  constructor() {
    super();
    this.ref = firebase.firestore().collection("bookmarks");
    this.state = {
      owner: "",
      isPublic: "true",
      name: "",
      notes: "",
      rating: "",
      url: "",
      thumbnail: "",
      isLoading: false,
      isValidUrl: false
    };
  }

  uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  }

  componentDidMount() {
    const handoff_url = new URL(window.location);

    let incoming_name = handoff_url.searchParams.get("name");
    let incoming_url = handoff_url.searchParams.get("url");

    firebase.auth().onAuthStateChanged((FBUser) => {
      if (FBUser) {
        this.setState({
          owner: FBUser.uid,
        });
      } else {
        navigate(`/login`, {
          state: { name: incoming_name, url: incoming_url },
        });
      }
    });

    if (incoming_name && incoming_name !== "") {
      this.setState({
        name: incoming_name,
      });
    }

    if (incoming_url && incoming_url !== "") {
      this.setState({
        url: incoming_url
      }, ()=> {
        this.fetchImage()
      });
    }
  }

  onChange = (e) => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);
  };

  onUrlChange = (e) => {
    if (e.target.checkValidity() === true && e.target.value !== '' ) {
      const state = this.state;
      console.log(e.target.value)
      state[e.target.name] = e.target.value;
      this.setState(state);
      this.fetchImage()
    } else {
      return false
    }

  }

  onSubmit = (e) => {
    e.preventDefault();

    const { owner, isPublic, name, notes, rating, url, thumbnail } = this.state;

    this.ref
      .add({
        owner,
        isPublic,
        name,
        notes,
        rating,
        url,
        thumbnail,
      })
      .then((docRef) => {
        this.setState({
          owner: "",
          isPublic: "",
          name: "",
          notes: "",
          rating: "",
          url: "",
          thumbnail: "",
        });
        navigate("/");
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  };

  fetchImage = () => {

    this.setState({ isLoading: true, thumbnail: null });

    fetch(
      `${process.env.REACT_APP_THUMBNAIL_CREATOR_URL}/image?url=${this.state.url}`
    )
      .then((response) => response.json())
      .then((thumb) => {
        var datapng = "data:image/png;base64," + thumb.image;
        document.getElementById("myimage").src = datapng.toString("base64");
        let storageRef = firebase
          .storage()
          .ref("images")
          .child(`${this.uuidv4()}.png`);
        storageRef.putString(thumb.image, "base64").then((snapshot) => {
          snapshot.ref.getDownloadURL().then((imageurl) => {
            this.setState({ isLoading: false });
            this.setState({ thumbnail: imageurl });
          });
        });
      });
  };

  handleUploadStart = () => this.setState({ isLoading: true, progress: 0 });
  handleProgress = (progress) => this.setState({ progress });
  handleUploadError = (error) => {
    this.setState({ isLoading: false });
    console.error(error);
  };
  handleUploadSuccess = (filename) => {
    this.setState({ avatar: filename, progress: 100, isLoading: false });
    firebase
      .storage()
      .ref("images")
      .child(filename)
      .getDownloadURL()
      .then((url) => {
        this.setState({ thumbnail: url })
                document.getElementById("myimage").src = url;

      });
  };

  render() {
    const { owner, isPublic, name, notes, rating, url, thumbnail } = this.state;
    return (
      <div>
        <h1 className="text-xl font-bold">Create Bookmark</h1>

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
            <div className="grid grid-cols-10">
              <div className="col-span-9">
                <label
                  htmlFor="url"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  URL:
                </label>
                <input
                  type="url"
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-3"
                  name="url"
                  id="url"
                  defaultValue={this.state.url}
                  onBlur={this.onUrlChange}
                />
              </div>
              <div className="col-span-1 ml-4">
                <img
                  alt="" className={this.state.thumbnail ? "" : "hidden"}
                  id="myimage"
                />

                {this.state.thumbnail ? (
                  ""
                ) : (
                  <div
                    className={
                      "thumbnail-placeholder bg-gray-200 " +
                      (this.state.isLoading ? "loading" : "")
                    }
                  >
                    {this.state.isLoading === true && !this.state.thumbnail ? (
                      <FaSpinner className="loading-spinner" />
                    ) : (
                      ""
                    )}
                  </div>
                )}
              </div>
            </div>
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
              className="ml-2"
              checked={this.state.isPublic === "true"}
            />
          </label>

          <label className="block text-gray-700 text-sm font-bold mb-2">
            Private
            <input
              type="radio"
              name="isPublic"
              value="false"
              onChange={this.onChange}
              className="ml-2"
              checked={this.state.isPublic === "false"}
            />
          </label>
          {/* <FileUploader
            accept="image/*"
            name="thumbnail"
            randomizeFilename
            storageRef={firebase.storage().ref("images")}
            onUploadStart={this.handleUploadStart}
            onUploadError={this.handleUploadError}
            onUploadSuccess={this.handleUploadSuccess}
            onProgress={this.handleProgress}
          /> */}
          <div>
            <button
              type="submit"
              className="bg-blue-700 hover:bg-blue-900 active:bg-blue-500 text-white font-bold py-2 px-4 rounded my-2 inline-block"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default Create;
