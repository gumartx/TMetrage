import { Link } from 'react-router-dom';
import './styles.css';

const ProfileEdit = () => {
  return (
    <div className="list-form-container">
      <div className="base-card list-form-card">
        <h1 className="list-form-title">DADOS DO PERFIL</h1>
        <form action="">
          <div className="list-form-content row">
            <div className="list-form-top-content col-lg-6">
              <label htmlFor="profile-form-name">Nome do Perfil</label>
              <input
                type="text"
                id="profile-form-name"
                placeholder="Digite o nome do perfil"
                className="form-control base-input"
              />
              <label htmlFor="profile-form-user">Nome do Usuário</label>
              <input
                type="text"
                id="profile-form-user"
                placeholder="Digite o nome do usuário"
                className="form-control base-input"
              />
              <label htmlFor="profile-form-password">Senha</label>
              <input
                type="text"
                id="profile-form-password"
                placeholder="Digite a senha"
                className="form-control base-input"
              />
            </div>
            <div className="list-form-bottom-content col-lg-6">
           
              <label htmlFor="profile-form-photo">Imagem de Perfil</label>
              <input
                type="text"
                id="profile-form-photo"
                placeholder="Inserir URL"
                className="form-control base-input"
              />
              <label htmlFor="profile-form-background">Imagem de Fundo</label>
              <input
                type="text"
                id="profile-form-background"
                placeholder="Inserir URL"
                className="form-control base-input"
              />
              
            </div>
          </div>
          <div className="list-form-bottons">
            <Link to="/profileDetails">
              <button className="btn btn-outline-danger btn-button-form">
                CANCELAR
              </button>
            </Link>
            <Link to="/profileDetails">
              <button className="btn btn-primary btn-save btn-button-form">
                SALVAR
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEdit;
