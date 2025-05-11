"use client";

import React from 'react'
import Link from '@node_modules/next/link'
import { usePathname } from 'next/navigation'

const Nav = () => {
    const currentPath = usePathname(); // Get the current path 
    const isActive = (path) => {       // arrow function to check if current path is match the given path (for menu highlight style)
        return currentPath.startsWith(path);
    }

    return (
        <div>
            <nav className='main-nav'>     
                <ul className="navigation-menu">    
                    <li>
                        <Link href="/">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link href="/projects" className={isActive("/projects") ? "active-navigation" : ""}>
                            Project
                        </Link>
                    </li>
                    <li>
                        <Link href="/articles" className={isActive("/articles") ? "active-navigation" : ""}>
                            Article
                        </Link>
                    </li>
                </ul>  
            </nav>
        </div>
  )
}

export default Nav