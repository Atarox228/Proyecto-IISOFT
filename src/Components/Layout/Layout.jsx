import Navbar from "../Navbar/Navbar.jsx";
import {Outlet} from "react-router-dom";


const Layout = () => {

  return (
      <div className='page-wrapper'>
        <Navbar/>
        <Outlet />
      </div>
  );
}

export default Layout;