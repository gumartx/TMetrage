import './styles.css';
import '@popperjs/core';
import 'bootstrap/js/src/collapse';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-md navbar-white bg-primary main-nav">
      <div className="container-fluid">
        <a href="link" className="nav-logo-text">
          <h4>TMétrage</h4>
        </a>

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
          <ul className="navbar-nav offset-md-8 main-menu">
            <li>
              <a href="link">Listas</a>
            </li>
            <li>
              <a href="link">Perfil</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
