import React, { useState, useEffect } from "react";
import firebase from "../Firebase";
import { navigate } from "@reach/router"
import { FaSpinner } from 'react-icons/fa'

const Create = () => {

    const handleChange = e => {
      setState({
        ...state,
        [e.target.name]: e.target.value
      })
    }

    useEffect(() => {
      const handoff_url = new URL(window.location);

      let incoming_name = handoff_url.searchParams.get("name");
      let incoming_url = handoff_url.searchParams.get("url");

      firebase.auth().onAuthStateChanged((FBUser) => {
        if (FBUser) {
          state.owner = FBUser.uid;
        } else {
          navigate(`/login`, {
            state: { name: incoming_name, url: incoming_url },
          });
        }
      });

      if (incoming_name && incoming_name !== "") {
        state.name = incoming_name;
      }

      if (incoming_url && incoming_url !== "") {
        state.url = incoming_url;
        fetchImage();
      }
    },[])


    function uuidv4() {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (
          c ^
          (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
      );
    }

    function onUrlChange(e) {
      if (e.target.checkValidity()) {
        setState({ ...state, url: e.target.value })
      } else {
        return false
      }
    }

    function onSubmit(e) {
      e.preventDefault();

      ref
        .add(state)
        .then(() => {
          navigate("/");
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });
    };

    function fetchImage(e) {

      if (e.target.checkValidity()) {
        setState({ ...state, url: e.target.value })


        if (state.thumbnail !== null && state.url !== "") {
          setState({ ...state, isLoading: true, thumbnail: null })

          fetch(
              `${process.env.REACT_APP_THUMBNAIL_CREATOR_URL}/image?url=${state.url}`
            )
            .then((response) => response.json())
            .then((thumb) => {
              var datapng = "data:image/png;base64," + thumb.image;
              document.getElementById("myimage").src = datapng.toString("base64");
              let storageRef = firebase
                .storage()
                .ref("images")
                .child(`${uuidv4()}.png`);
              storageRef.putString(thumb.image, "base64").then((snapshot) => {
                snapshot.ref.getDownloadURL().then((imageurl) => {
                  setState({ ...state, isLoading: false, thumbnail: imageurl })
                });
              });
            });

        } else {
          return false
        }
      }
    };

    const [state, setState] = useState({
      owner: "",
      isPublic: "",
      name: "",
      notes: "",
      rating: "",
      url: "",
      thumbnail: "",
      isLoading: "",
      isValidUrl: "",
    })
  
  const ref = firebase.firestore().collection("bookmarks");
 
    return (
      <div>
        <h1 className="text-xl font-bold">Create Bookmark</h1>

        <form onSubmit={e => onSubmit(e)}>
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
              value={state.name}
              onChange={handleChange}
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
                  value={state.url}
                  onChange={handleChange}
                  onBlur={fetchImage}
                />
              </div>
              <div className="col-span-1 ml-4">
                <img
                  alt="" className={state.thumbnail ? "" : "hidden"}
                  id="myimage"
                />

                {state.thumbnail ? (
                  ""
                ) : (
                  <div
                    className={
                      "thumbnail-placeholder bg-gray-200 " +
                      (state.isLoading ? "loading" : "")
                    }
                  >
                    {state.isLoading === true && !state.thumbnail ? (
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
              value={state.notes}
              onChange={handleChange}
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
              value={state.rating}
              onChange={handleChange}
            />
          </div>

          <label className="block text-gray-700 text-sm font-bold mb-2">
            Public
            <input
              type="radio"
              name="isPublic"
              value="true"
              onChange={handleChange}
              className="ml-2"
              checked={state.isPublic === "true"}
            />
          </label>

          <label className="block text-gray-700 text-sm font-bold mb-2">
            Private
            <input
              type="radio"
              name="isPublic"
              value="false"
              onChange={handleChange}
              className="ml-2"
              checked={state.isPublic === "false"}
            />
          </label>

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
export default Create;
