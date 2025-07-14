import React from 'react';

export default function VideoPlayer() {
  return (
    <div className="text-center mt-5">
      <video controls width="720" className="rounded">
        <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}