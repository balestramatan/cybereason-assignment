import { useAuth } from '../../context/AuthContext';
import './Header.css'

const Header = () => {
    const { isAuthenticated, logout } = useAuth();

    const logoutHandler = () => {
        logout()
    }
    return(
        <header className='header-container'>
            <span className={isAuthenticated ? 'is-authenticated' : ''} onClick={isAuthenticated ? logoutHandler : ()=>{}}>
                {isAuthenticated ? 'Logout' : 'Welcome!'}
            </span>
            <img src='/assets/logo.png' alt='logo' />
        </header>
    )
}

export default Header;