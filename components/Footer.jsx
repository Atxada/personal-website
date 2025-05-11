

import React from 'react'
import Link from '@node_modules/next/link'
import { EmailIcon, GithubIcon, LinkedinIcon } from "@components/icons";
import { getAllPosts, getAllTags } from '@utils/posts';
import { Tag } from '@components/tags';

const Footer = () => {
    const posts = getAllPosts();
    const tags = getAllTags(posts)
    const sortedTags = Object.keys(tags).sort()

    return (
        <div className='mt-auto text-[#929292] flex flex-col items-center'>
            <div className='tags-section'>
              <h2 className='text-xl'>Tags</h2>
              <div className="tags-bar">
                  {sortedTags?.map((tag) => (
                      <Tag tag={tag} key={tag} count={tags[tag]}/>
                  ))}
              </div>
            </div>
            <footer className='footer'>     
                <ul className='flex p-0 gap-3 justify-center mt-5 mb-3'>
                    <li>
                        <Link className="contact-btn" href="https://www.linkedin.com/in/aldo-aldrich-962975220/"><LinkedinIcon /></Link>
                    </li>
                    <li>
                        <Link className="contact-btn" href="https://github.com/Atxada"><GithubIcon /></Link>
                    </li>
                    <li>
                        <Link className="contact-btn" href="mailto:atxadacony@gmail.com"><EmailIcon /></Link>
                    </li>
                </ul>
                <p className='text-center mt-0 mb-7'>© 2025 Aldo Aldrich</p>
            </footer>
        </div>
  )
}

export default Footer