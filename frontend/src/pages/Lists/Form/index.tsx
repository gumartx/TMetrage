import { Link } from 'react-router-dom';
import MovieCard from './MovieCard';
import './styles.css';

const Form = () => {
  return (
    <div className="list-form-container">
      <div className="base-card list-form-card">
        <h1 className="list-form-title">DADOS DA LISTA</h1>
        <form action="">
          <div className="list-form-content row">
            <div className="list-form-top-content col-lg-6">
              <label htmlFor="list-form-name">Nome</label>
              <input
                type="text"
                id="list-form-description"
                placeholder="Digite o nome da lista"
                className="form-control base-input"
              />
              <label htmlFor="list-form-description">Descrição</label>
              <textarea
                name=""
                rows={10}
                id="list-form-description"
                placeholder="Digite a descrição da lista"
                className="form-control base-input list-form-description-board"
              ></textarea>
            </div>
            <div className="list-form-bottom-content col-lg-6">
              <div className="btn-container">
                <button className="btn btn-primary btn-add-movie btn-save">
                  <h6>ADICIONAR FILME</h6>
                </button>
                <input
                  type="text"
                  placeholder="Digite o nome do filme"
                  className="form-control base-input form-list"
                />
              </div>
              <div className="list-form-movies">
                <MovieCard />
                <MovieCard />
                <MovieCard />
                <MovieCard />
              </div>
            </div>
          </div>
          <div className="list-form-bottons">
            <Link to="/lists">
              <button className="btn btn-outline-danger btn-button-form">
                CANCELAR
              </button>
            </Link>
            <Link to="/lists">
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

export default Form;
