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

  const routeWithElements = [RoutesPathList.Today, RoutesPathList.BookDesk]
  

  return (
    <Fragment>
      {routeWithElements.includes(location.pathname as RoutesPathList) ? (
        <Header />
      ) : null}
      <div className='style'>
      {routeWithElements.includes(location.pathname as RoutesPathList) ? (
        <Navbar />
      ) : null}
      {children}
      </div>
      
      
    </Fragment>
  );
};

export default Layout;
