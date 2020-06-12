import React, { Component } from "react";
import { Link } from "@reach/router";
import {FaExternalLinkAlt} from 'react-icons/fa'

class BookmarksList extends Component {
  render() {
    return (
      <div className="">
        <h1 className="text-xl font-bold">Bookmarks</h1>
        <Link
          to="/create"
          className="bg-blue-700 hover:bg-blue-900 active:bg-blue-500 text-white font-bold py-2 px-4 rounded my-2 inline-block"
        >
          Add Bookmark
        </Link>
        <ul>
          {this.props.bookmarks.map(bookmark => (
            <li key={bookmark.key} className="flex items-start border border-collapse -mt-px p-2">
              {bookmark.thumbnail && (
                <img alt="" src={bookmark.thumbnail} className="w-20 h-auto mr-2"></img>
              )}
              {!bookmark.thumbnail && (
                <div className="w-20 h-20 bg-gray-200 mr-2"></div>
              )}
              
              <ul className="">
                <li>
                  <Link to={`/show/${bookmark.key}`} className="text-blue-700 font-bold underline hover:text-blue-900 active:text-blue-500">
                    {bookmark.name ? (
                      bookmark.name
                    ) : (
                      '[blank]'
                    )}
                  </Link>
                </li>
                <li><a href={bookmark.url} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-gray-700 active:text-black">
                  <FaExternalLinkAlt className="inline-block icon-adjust"/> 
                    {bookmark.url ? (
                      bookmark.url
                    ) : (
                      '[blank]'
                    )}
                </a></li>
                {bookmark.rating}
                <p>{bookmark.isPublic}</p>
                <p>{bookmark.notes}</p>
              </ul>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default BookmarksList;
