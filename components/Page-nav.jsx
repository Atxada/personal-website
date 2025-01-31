"use client"

import { slug } from '@node_modules/github-slugger'
import { useEffect, useState } from 'react';


const PageNav = ({ h2Headings }) => {
    
    let [activeSection, setActiveSection] = useState(slug(h2Headings[0]))

    function scrollToElement(id, sections) {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView();
        }
        // const newUrl = `${window.location.origin}${window.location.pathname}#${id}`;
        // window.history.pushState(null, '', newUrl);
        setTimeout(() => {setActiveSection(id)}, 50); // add timeout so observer done its function first and you can setactivesection again
        
      }

    useEffect(() => {

        const sections = h2Headings.map(heading =>document.getElementById(slug(heading)))

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 1,
        };

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry=> {
            if (entry.isIntersecting){
                setActiveSection(entry.target.id)
            }
        })
    }, observerOptions)

    sections?.forEach(section => {
        section && observer.observe(section)
      })
      }, [])
    

    return (h2Headings.length > 0 && (
    <aside className='on-this-page-container'>
        <p className='font-bold'>ON THIS PAGE</p>
        <ul className='pl-2'> {h2Headings.map((heading, index) => (
            <li key={index}>
                <button className={`on-this-page-link ${activeSection == slug(heading) && "on-this-page-link-active"}`}  onClick={() => scrollToElement(`${slug(heading)}`)}>{heading}</button>
            </li>))}
        </ul>
    </aside>
  ))
}

export default PageNav