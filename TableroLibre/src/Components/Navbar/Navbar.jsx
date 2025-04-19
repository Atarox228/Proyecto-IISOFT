import './Navbar.css';
import logo from '../../assets/logo.png';
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import UserInfo from "../UserInfo";

const Navbar = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div className='navbar-wrapper'>
            <Link to="/">
                <img src={logo} className='logo' alt="logo"/>
            </Link>
            
            {isAuthenticated && <UserInfo />}
        </div>
    );
};

export default Navbar;