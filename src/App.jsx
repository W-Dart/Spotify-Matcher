import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Layout from './structure/Layout.jsx'
import Home from './structure/pages/Home.jsx'
import Results from './structure/pages/Results.jsx'
import About from './structure/pages/About.jsx'
import NoMatch from './structure/pages/NoMatch.jsx'

//import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  

  return (
 
      <BrowserRouter>
        <Routes>
          <Route path="/Spotify-Matcher/" element={<Layout/>}>
            <Route index element={<Home />} />
            <Route path="/Spotify-Matcher/about" element={<About/>}></Route>
            <Route path="/Spotify-Matcher/results" element={<Results/>}></Route>
            <Route path="*" element={<NoMatch />} />
          </Route>
        </Routes>
      </BrowserRouter>

    
  )
}

export default App
