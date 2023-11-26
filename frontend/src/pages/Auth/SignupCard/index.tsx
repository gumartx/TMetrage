import { Link } from 'react-router-dom';
import { ReactComponent as ArrowIcon } from 'assets/images/arrow.svg';

import './styles.css';

const Signup = () => {
  return (
    <div className="base-card login-card">
      <h1>CADASTRO</h1>
      <form>
      <div className="mb-4">
          <input
            type="text"
            className="form-control base-input"
            placeholder="Nome"
            name="username"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            className="form-control base-input"
            placeholder="Nome de Usuário"
            name="username"
          />
        </div>
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
        <div className="my-4 login-submit">
          <Link to="/auth/login">
            <div className="btn-container">
              <button className="btn btn-primary">
                <h6>Cadastrar</h6>
              </button>
              <div className="btn-icon-container">
                <ArrowIcon />
              </div>
            </div>
          </Link>
        </div>
        <div className="signup-container">
          <span className="not-registered">Já tem Cadastro?</span>
          <Link to="/auth/login" className="login-link-register">
            LOGAR
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
