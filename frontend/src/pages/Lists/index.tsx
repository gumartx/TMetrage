import ListCard from 'components/ListCard';
import './styles.css';
import GoBack from 'components/GoBack';
import { Link } from 'react-router-dom';

const Lists = () => {
  return (
    <div className="list-container">
      <div className="base-card list-card">
        <div className="btn-goback-container">
          <GoBack />
        </div>
        <div className="btn-list-container">
          <button className="btn btn-primary btn-list">
            <h6>CRIAR UMA LISTA</h6>
          </button>
        </div>
        <div className="list-title-container">
          <h1>Listas</h1>
        </div>
        <div className="row">
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
          <div className="col-sm-6 col-lg-4 col-xl-3">
            <ListCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lists;
