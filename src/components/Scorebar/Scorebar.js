import React from 'react';
import Search from '../Search';
import './Scorebar.css';

const Scorebar = ({score, children, searchTerm, onSearchChange,onSearchSubmit}) => 
  <div className='scorebar navbar' >
    <ul className='d-flex'>
        <li className="brand">
          <a href="/">Clicky Game</a>
          </li>
        <li className="">Click an image to begin!</li>
        <li>Score: {score}   {children}</li>
    </ul>
    <Search 
            value={searchTerm}
            onChange={onSearchChange}
            onSubmit={onSearchSubmit}
          >
            Try others?
        </Search>
  
  </div>

export default Scorebar;