import React, { useState, useEffect } from 'react'
import firebase from '../Firebase'
import {navigate} from "@reach/router"


const Bookmarklet = () => {
    
  useEffect(()=>{
      firebase.auth().onAuthStateChanged(FBUser => {
      
      if (!FBUser) {
        navigate(`/login`)
      }
    })    
  })

  const host_url = process.env.REACT_APP_HOST_URL

  // eslint-disable-next-line
  const href_string = `javascript:location.href='${host_url}/create?url='+encodeURIComponent(location.href)+'&name='+encodeURIComponent(document.title)+''`

  return (
    <>
      <h1 className="text-xl font-bold">Bookmarks-a-lot Bookmarklet</h1>
      <p>Drag this to your bookmarks bar, or whatever it is in your browser of choice.</p>
      <p className="mt-4 text-shadow">
        <a className="bg-gray-600 hover:bg-gray-800 p-2 px-4 text-white rounded" href={href_string}>Add to Bookmarks-a-lot</a>
      </p>        
    </>
  )
}

export default Bookmarklet