import ListCard from 'components/ListCard';
import './styles.css';
import GoBack from 'components/GoBack';
import { Link } from 'react-router-dom';

const Lists = () => {
  return (
    <div className="list-container">
      <div className="base-card list-card">
        <div className="btn-goback-container">
        <Link to="/menu">
            <div className="goback-container">
              <GoBack />
            </div>
          </Link>
        </div>
        <div className="btn-list-container">
          <Link to="/list/form">
            <button className="btn btn-primary btn-list">
              <h6>CRIAR UMA LISTA</h6>
            </button>
          </Link>
        </div>
        <div className="list-title-container">
          <h1>Listas</h1>
        </div>
        <div className="row list-movies">
          <div className="col-sm-6 col-lg-4 col-xl-3">
            <Link to="/lists/:listId">
              <ListCard />
            </Link>
          </div>
          <div className="col-sm-6 col-lg-4 col-xl-3">
            <ListCard />
          </div>
          <div className="col-sm-6 col-lg-4 col-xl-3">
            <ListCard />
          </div>
          <div className="col-sm-6 col-lg-4 col-xl-3">
            <ListCard />
          </div>
          <div className="col-sm-6 col-lg-4 col-xl-3">
            <ListCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lists;
