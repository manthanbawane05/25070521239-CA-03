import { Link, NavLink } from 'react-router-dom';
import './App.css';

const Nav = ({ user, onLogout }) =>{

    return (

        <nav className='my-nav'>
            <div className='nav-brand'>
                <Link to = "/">Flow Parts<span className='brand-dot'>.</span></Link>
            </div>
            <ul className='d-flex' style={{listStyle:"none", margin:0}}>
                <li>
                    <NavLink to = "/" end>Home</NavLink>
                </li>
                <li>
                    <NavLink to = "/parts">Parts</NavLink>
                </li>
                <li>
                    <NavLink to = "/about">About</NavLink>
                </li>
                <li>
                    <NavLink to = "/contact">Contact</NavLink>
                </li>
            </ul>
            <div className='nav-auth'>
                { user ? (

                    <>
                        <span className='nav-user'>Hi, {user.name}</span>
                        <button className='signout-btn' onClick = {onLogout}>Sign Out</button>
                    </>

                ) : (

                    <NavLink to = "/signin">Sign In</NavLink>
                )}
            </div>
        </nav>
    )
}


export default Nav;
