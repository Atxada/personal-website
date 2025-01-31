import React from 'react'

const Email = () => {
  return (
    <div className='contact-container'>
        <form action="" className='contact-left'>
            <div className="contact-left-title">
                <h2>Get in touch</h2>
                <hr></hr>
            </div>
            <input type='text' name='name' placeholder='Name' className='contact-inputs' required />
            <input type='email' name='email' placeholder='Email' className='contact-inputs' required />
            <input type='subject' name='subject' placeholder='Subject' className='contact-inputs' required />
            <textarea name="message" placeholder='Message' className='contact-inputs' required></textarea>
            <button type='submit'>Send Email</button>
        </form>
        <div className="contact-right"></div>
        Email

    </div>
  )
}

export default Email