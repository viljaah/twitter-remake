// import React from 'react';
import styles from './SideBar.module.css';
import { NavLink } from 'react-router-dom';
import XSvg from '../svgs/X';

function SideBar() {
    return (
        <nav className={styles.sidebar}>
            <ul>
                <li>
                    <XSvg className={styles.logo} />
                </li>
                <li>
                    <NavLink to={"/"}>Home</NavLink>
                </li>
                <li>
                    <NavLink to={"/explore"}>Explore</NavLink>
                </li>
                <li>
                    <a href="">Notifications</a>
                </li>
                <li>
                    <a href="">Messaages</a>
                </li>
                <li>
                    <a href="">Bookmarks</a>
                </li>
                <li>
                    <a href="">Jobs</a>
                </li>
                <li>
                    <a href="">Communities</a>
                </li>
                <li>
                    <a href="">Premium</a>
                </li>
                <li>
                    <NavLink to={"/profile"}>Profile</NavLink>
                </li>
                <li>
                    <NavLink to={"/settings"}>More</NavLink>
                </li>
                <li>
                    <button>Post</button>
                </li>
                <li>
                    <button>:username</button>
                </li>
            </ul>
        </nav>
    );
}

export default SideBar;