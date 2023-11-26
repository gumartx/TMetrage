import './styles.css';
import '@popperjs/core';
import 'bootstrap/js/src/collapse';

import { Link, NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-md navbar-white bg-primary main-nav">
      <div className="container-fluid">
        <Link to="/menu" className="nav-logo-text">
          <h4>TMétrage</h4>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#tmetrage-navbar"
          aria-controls="tmetrage-navbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="tmetrage-navbar">
          <ul className="navbar-nav offset-md-7 main-menu">
            <li>
              <NavLink to="/menu">Menu</NavLink>
            </li>
            <li>
              <NavLink to="/lists">Listas</NavLink>
            </li>
            <li className="profile-dropdown">
              <NavLink to="/profileDetails">Perfil</NavLink>
              <ul className="profile-menu">
                <li>
                  <NavLink to="/profileDetails">Visualizar Perfil</NavLink>
                </li>
                <li>
                  <NavLink to="/profileEdit">Editar Perfil</NavLink>
                </li>
                <li>
                  <NavLink to="/lists">Listas</NavLink>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
