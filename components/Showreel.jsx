"use client"

import Link from '@node_modules/next/link';
import React from 'react'
import { VideoIcon, CloseIcon } from './icons';

const iframeSrc = "https://www.youtube.com/embed/HrYZbxO3Jso?si=9nuqOzCTGNda4Y-4&autoplay=1"
function showVideo() {
    const popup = document.querySelector('.popup')
    const video = document.querySelector("iframe")
    popup.classList.toggle('active');
    if (!popup.classList.contains('active')){
      video.src = "";
    }
    else {
      video.src = iframeSrc;
    }
  }

const Showreel = () => {
  return (
    <div>
        <Link className="home-works-btn" href="" onClick={() => showVideo()}><VideoIcon />Showreel</Link>
        <div className="popup" >
            <iframe width="560" height="315" className="absolute top-2 left-2" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
            <div className="close" onClick={() => showVideo()} >    
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="size-7" fill="#e8eaed">
                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
              </svg>
            </div>
          </div>
    </div>
  )
}

export default Showreel