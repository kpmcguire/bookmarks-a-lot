import React, { Component } from "react";
import { Link } from "@reach/router";
import {FaExternalLinkAlt} from 'react-icons/fa'

class BookmarksList extends Component {
  render() {
    return (
      <div>
        <h1 className="text-xl font-bold"> {this.props.displayName}'s Bookmarks</h1>
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
                <img alt="" src={bookmark.thumbnail} className="w-20 h-auto m-1 mr-2 flex-shrink-0"></img>
              )}
              {!bookmark.thumbnail && (
                <div className="w-20 h-20 bg-gray-200 m-1 mr-2 flex-shrink-0"></div>
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
                  
                  <span className="inline-block py-1.5 px-2.5 ml-2 text-xs leading-none text-center whitespace-nowrap align-baseline font-bold bg-slate-600 text-white rounded">{bookmark.isPublic ? 'Public' : 'Private'}</span>

                  
                </li>
                <li><a href={bookmark.url} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-gray-700 active:text-black">
                  <FaExternalLinkAlt className="inline-block icon-adjust"/> 
                    {bookmark.url ? (
                      bookmark.url
                    ) : (
                      '[blank]'
                    )}
                </a></li>
                <p>{bookmark.notes}</p>
              </ul>
            </li>
          ))}
        </ul>
        
          {this.props.numBookmarksShown < this.props.totalNumBookmarks &&          
            <button type="button" onClick={this.props.onNextPage} className={
            "bg-green-700 hover:bg-green-900 active:bg-green-500 text-white font-bold py-2 px-4 rounded my-2"}>
              Load more
            </button>
          }
        
      </div>
    );
  }
}

export default BookmarksList;
