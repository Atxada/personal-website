import React from 'react'

const ImgCaption = (props) => {
  return (
    <span className='flex flex-col gap-1'>
        <img src={props.src} alt={props.alt} title={props.title}></img>
        <i className='img-caption'>{props.title}</i>
    </span>
    
  )
}

export default ImgCaption