import './Navbar.css'

import logo from '../../assets/logo.png'

const Navbar = ({onClick}) => {
    return (
        <div className='navbar-wrapper'>
               <img src={logo} className='logo' onClick={onClick}/>
               

        </div>
    )
}

export default Navbar;