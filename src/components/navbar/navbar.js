import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './navbar.css';

export const Navbar = () =>{

    const[menuActive, setMenuActive] = useState(false);

    return (
        <nav>
            <div className='menu' onClick={()=>{
                setMenuActive(!menuActive);
            }}>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <Link to="/" className='title'>SAMFLIX</Link>
            <ul className={menuActive ? "open": ""}>
                <li><NavLink to="/movies">Movies</NavLink></li>
                <li><NavLink to="/series">Series</NavLink></li>
            </ul>
        </nav>
    )
}