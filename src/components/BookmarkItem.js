import React from 'react';

const BookmarkItem = (image) => {
  return (
    <div className="gif-item">
      <img alt=" " src={image.gif.images.downsized.url} />
    </div>
  )
};

export default BookmarkItem;
