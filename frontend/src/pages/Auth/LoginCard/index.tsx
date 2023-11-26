import { Link } from 'react-router-dom';
import { ReactComponent as ArrowIcon } from 'assets/images/arrow.svg';

import './styles.css';

const Login = () => {
  return (
    <div className="base-card login-card">
      <h1>LOGIN</h1>
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
            placeholder="Password"
            name="password"
          />
        </div>
        <Link to="/auth/recover" className="login-link-recover">
          Esqueci a senha
        </Link>
        <div className="login-submit">
          <Link to="/menu">
            <div className="btn-container">
              <button className="btn btn-primary">
                <h6>Fazer login</h6>
              </button>
              <div className="btn-icon-container">
                <ArrowIcon />
              </div>
            </div>
          </Link>
        </div>
        <div className="signup-container">
          <span className="not-registered">Não tem Cadastro?</span>
          <Link to="/auth/signup" className="login-link-register">
            CADASTRAR
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
