import { Link } from 'react-router-dom';
import { ReactComponent as ArrowIcon } from 'assets/images/arrow.svg';

import './styles.css';

const Recover = () => {
  return (
    <div className="base-card login-card">
      <h1>RECUPERAR SENHA</h1>
      <form>
        <div className="mb-4">
          <input
            type="text"
            className="form-control base-input"
            placeholder="Email"
            name="username"
          />
        </div>
        <div className="mb-2">
          <input
            type="password"
            className="form-control base-input "
            placeholder="New Password"
            name="password"
          />
        </div>
        <div className="my-4 login-submit">
          <Link to="/auth/login">
            <div className="btn-container">
              <button className="btn btn-primary">
                <h6>Salvar</h6>
              </button>
              <div className="btn-icon-container">
                <ArrowIcon />
              </div>
            </div>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Recover;
