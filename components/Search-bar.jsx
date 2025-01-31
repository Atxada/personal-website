"use client"

import React, { useState } from 'react'

const SearchBar = () => {
  const [search, setSearch] = useState('')

  return (
    <form>
        <input type="search" placeholder="Search" onChange={(text) => setSearch(text.target.value)}></input>
    </form>
  )
}

export default SearchBar