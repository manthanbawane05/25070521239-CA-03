import { Link, NavLink } from 'react-router-dom';
import './App.css';

const Nav = () =>{

    return (

        <nav className='my-nav'>
            <div className='nav-brand'>
                <Link to = "/">FLEXI<span className='brand-dot'>.</span></Link>
            </div>
            <ul className='d-flex' style={{listStyle:"none", margin:0}}>
                <li>
                    <NavLink to = "/">Home</NavLink>
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
        </nav>
    )
}


export default Nav;
