import { NavLink } from 'react-router-dom';
import s from './Header.module.css';

const getClass = isActive => (isActive ? s.active : s.link);

const Header = () => {
    return (
        <header className={s.header}>
            <nav className={s.nav}>
                <NavLink to="/" className={({ isActive }) => getClass(isActive)}>
                    Головна
                </NavLink>
                <NavLink to="/data" className={({ isActive }) => getClass(isActive)}>
                    База даних
                </NavLink>
                <NavLink to="/records" className={({ isActive }) => getClass(isActive)}>
                    Перехвати
                </NavLink>
            </nav>
        </header>
    );
};

export default Header;
