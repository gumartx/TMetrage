import './styles.css';
import '@popperjs/core';
import 'bootstrap/js/src/collapse';

import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-md navbar-white bg-primary main-nav">
      <div className="container-fluid">
        <Link to="/auth" className="nav-logo-text">
          <h4>TMétrage</h4>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
