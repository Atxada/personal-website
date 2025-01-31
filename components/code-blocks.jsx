"use client"

import CopyToClipboard from 'react-copy-to-clipboard';
import { CheckIcon, CopyIcon } from './icons';
import { useEffect, useState, useRef } from 'react';
import markdownit from 'markdown-it';

// Highlighter
import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/github-dark.min.css';
// register only necessary language
hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'));
hljs.registerLanguage('python', require('highlight.js/lib/languages/python'));

const md = markdownit({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }
    return ''; // use external default escaping
  }
});

const CodeBlocks = (props) => {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {setCopied(false)}, 1000)
    return () => clearTimeout(timer)
  }, [copied])

  //cheat way, get the class name and substract the 'lang-', there might be better way, cause right now code is nested pretty deep inside props
  const htmlConverter = md.render("```"+(props.className ? props.className.substring(5) : "")+"\n"+props.children+"```")

  return (
    <div className='relative code-blocks'> 
      <CopyToClipboard text={props.children} onCopy={() => setCopied(true)}>
        <button className='copy-icon'>
          {copied ? <CheckIcon /> : <CopyIcon/>}
        </button>
      </CopyToClipboard>
      <div className="code-blocks-content" dangerouslySetInnerHTML={{ __html: htmlConverter}} ></div>
    </div>
  )
}

export default CodeBlocks