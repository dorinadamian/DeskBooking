import React, { Fragment } from 'react'
import {useLocation} from 'react-router-dom';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import { RoutesPathList } from '../config/routes/Routes';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {

  const location = useLocation();

  const routeWithElements = [RoutesPathList.Today, RoutesPathList.BookDesk, RoutesPathList.Bookings, RoutesPathList.ChooseDesk]
  

  return (
    <Fragment>
      {routeWithElements.includes(location.pathname as RoutesPathList) ? (
        <Header />
      ) : null}
      <div className="layout">
      {routeWithElements.includes(location.pathname as RoutesPathList) ? (
        <div className="navbar" style={{width: '16%', paddingTop: '1.2%', paddingBottom: '1.2%'}}>
          <Navbar />
        </div>
      ) : null}
        <div className="content">{children}</div>
      </div>
      
      
    </Fragment>
  );
};

export default Layout;
