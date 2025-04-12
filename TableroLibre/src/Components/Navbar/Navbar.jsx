import './Navbar.css'

import logo from '../../assets/logo.png'
import {Link} from "react-router";

const Navbar = () => {
    return (
        <div className='navbar-wrapper'>
          <Link to="/">
            <img src={logo} className='logo' alt="logo"/>
          </Link>
        </div>
    )
}

export default Navbar;