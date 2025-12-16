import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './NavItem.module.css';
const NavItem = ({ to, label, onClick }) => {
    return (
        <li className={styles.navItem}>
            <NavLink to={to} className={({ isActive }) => isActive ? styles.active : ''} onClick={onClick}>
                {label}
            </NavLink>
        </li>
    );
};

export default NavItem;