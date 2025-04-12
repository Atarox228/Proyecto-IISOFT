import Navbar from "../Navbar/Navbar.jsx";
import {Outlet} from "react-router";


const Layout = () => {

  return (
      <div className='page-wrapper'>
        <Navbar/>
        <Outlet />
      </div>
  );
}

export default Layout;