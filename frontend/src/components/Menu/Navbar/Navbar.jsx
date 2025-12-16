import React, { useState } from 'react';
import { Folder } from 'lucide-react';
import styles from './Navbar.module.css';
import { useUserContext } from '../../../context/userContext';
import NavItem from '../NavItem/NavItem';
import MenuButton from '../MenuButton/MenuButton';
import getApiURL from '../../../utils/getApiURl';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
    const { user, setUser } = useUserContext();
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await fetch(getApiURL('/api/auth/logout'), {
                method: 'POST',
                credentials: 'include'
            });
            setUser(null);
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const links = [
        {
            label: "Home",
            link: "/",
            visible: !!user,
        },
        {
            label: "Login",
            link: "/login",
            visible: !user,
        },
        {
            label: "Sign Up",
            link: "/signup",
            visible: !user,
        },
    ];

    return (
        <nav className={styles.navBar}>
            <div className={styles.logoCnt}>
                <Folder className={styles.logo} />
                <span className={styles.logoText}>My Drive</span>
            </div>
            <div className={`${styles.navLinks} ${menuOpen ? styles.open : ''}`}>
                {
                    links.map(({ label, link, visible }, index) => visible && <NavItem key={index} to={link} label={label} onClick={() => setMenuOpen(false)} />)
                }
                {user && (
                    <button className={styles.logoutBtn} onClick={handleLogout}>
                        Logout
                    </button>
                )}
            </div>
            <div className={styles.menuButtonWrapper}>
                <MenuButton open={menuOpen} setOpen={setMenuOpen} />
            </div>
        </nav>
    )
}
