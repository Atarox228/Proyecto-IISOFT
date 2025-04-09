import './Navbar.css'

import logo from '../../assets/logo.png'

const Navbar = () => {
    return (
        <div className='navbar-wrapper'>
               <img src={logo} className='logo'/>
               <div className='userpanel'>
               </div>

        </div>
    )
}

export default Navbar;