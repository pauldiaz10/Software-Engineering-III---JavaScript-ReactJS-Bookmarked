import React from 'react';
import BookmarkItem from './BookmarkItem';

const BookmarkList = (props) => {
  const gifItems = props.gifs.map((image) => {
    return <BookmarkItem key={image.id} gif={image} />
  });

  return (
    <div className="gif-list">{gifItems}</div>
  );
};

export default BookmarkList;
