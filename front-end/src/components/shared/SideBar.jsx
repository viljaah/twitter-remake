// import React from 'react';
import styles from "./SideBar.module.css";
import { NavLink } from "react-router-dom";
import XSvg from "../svgs/X";
import { GoHome } from "react-icons/go";
import { GoSearch } from "react-icons/go";
import { GoBell } from "react-icons/go";
import { GoMail } from "react-icons/go";
import { BsPeople } from "react-icons/bs";
import { GoBookmark } from "react-icons/go";
import { BsBriefcase } from "react-icons/bs";
import { GoVerified } from "react-icons/go";
import { BsPerson } from "react-icons/bs";
import { CiCircleMore } from "react-icons/ci";
import { IoIosMore } from "react-icons/io";

function SideBar() {
  return (
    <nav className={styles.sidebar}>
      <ul>
        <li>
          <NavLink to="/">
            <XSvg className={styles.icon} />
          </NavLink>
        </li>
        <li>
          <NavLink to="/">
            <GoHome className={styles.icon} />
            <span className={styles.linkText}>Home</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/explore">
            <GoSearch className={styles.icon} />
            <span className={styles.linkText}>Explore</span>
          </NavLink>
        </li>
        <li>
          <a href="#" className={styles.link}>
            <GoBell className={styles.icon} />
            <span className={styles.linkText}>Notifications</span>
          </a>
        </li>
        <li>
          <a href="#" className={styles.link}>
            <GoMail className={styles.icon} />
            <span className={styles.linkText}>Messages</span>
          </a>
        </li>
        <li>
          <a href="#" className={styles.link}>
            <GoBookmark className={styles.icon} />
            <span className={styles.linkText}>Bookmarks</span>
          </a>
        </li>
        <li>
          <a href="#" className={styles.link}>
            <BsBriefcase className={styles.icon} />
            <span className={styles.linkText}>Jobs</span>
          </a>
        </li>
        <li>
          <a href="#" className={styles.link}>
            <BsPeople className={styles.icon} />
            <span className={styles.linkText}>Communities</span>
          </a>
        </li>
        <li>
          <a href="#" className={styles.link}>
            <GoVerified className={styles.icon} />
            <span className={styles.linkText}>Premium</span>
          </a>
        </li>
        <li>
          <NavLink to="/profile/username">
            <BsPerson className={styles.icon} />
            <span className={styles.linkText}>Profile</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/settings">
            <CiCircleMore className={styles.icon} />
            <span className={styles.linkText}>More</span>
          </NavLink>
        </li>
        <li>
          <button className={styles.postBtn}>Post</button>
        </li>
        {/* mulig denne må endres litt i og med at vi skal ha logout her, kanskje det må være en link..? */}
        <li className={styles.userSection}>
          <button className={styles.userButton}>
            <img
              src="https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg"
              className={styles.profileImg}
            />
            <span className={styles.username}>@username</span>
            <IoIosMore className={styles.icon} />
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default SideBar;
