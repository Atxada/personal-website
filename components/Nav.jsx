"use client";

import React from 'react'
import Link from '@node_modules/next/link'
import { usePathname } from 'next/navigation'
import { CubeIcon, HomeIcon, NewsIcon, GithubIcon, LinkedinIcon, EmailIcon } from './icons';
import SearchBar from './Search-bar';

const Nav = () => {
    const currentPath = usePathname(); // Get the current path 
    if (currentPath=='/') {            // if current route is home don't proceed/render
        return
    }
    const isActive = (path) => {       // arrow function to check if current path is match the given path
        return currentPath.startsWith(path);
    }

    return (
        <div className='sidebar-nav'>
            <div className='sidebar-header'>
                <p className="text-2xl m-1">Aldo Aldrich</p>
                <p className="text-xs m-0 font-bold">Still solving tech problem...</p>
                <div >
                    <ul className='contact-list'>
                        <li>
                            <Link className="home-contact-btn" href="https://www.linkedin.com/in/aldo-aldrich-962975220/"><LinkedinIcon /></Link>
                        </li>
                        <li>
                            <Link className="home-contact-btn" href="https://github.com/Atxada"><GithubIcon /></Link>
                        </li>
                        <li>
                            <Link className="home-contact-btn" href="mailto:atxadacony@gmail.com"><EmailIcon /></Link>
                        </li>
                    </ul>
                </div>
            </div>
            <nav>     
                <ul className="navigation-menu">    
                    <li>
                        <Link href="/">
                            <HomeIcon />
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link href="/projects" className={isActive("/projects") ? "active-navigation" : ""}>
                            <CubeIcon />
                            Project
                        </Link>
                    </li>
                    <li>
                        <Link href="/articles" className={isActive("/articles") ? "active-navigation" : ""}>
                            <NewsIcon />
                            Article
                        </Link>
                    </li>
                </ul>  
            </nav>
            <p className="copyright-lbl">© 2025 Aldo Aldrich</p>
        </div>
  )
}

export default Nav