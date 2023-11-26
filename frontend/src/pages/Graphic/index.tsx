import DonutChart from 'components/DonutChart';
import './style.css';
import BarChart from 'components/BarChart';
import GoBack from 'components/GoBack';
import { Link } from 'react-router-dom';

const Graphic = () => {
  return (
    <div className="chart-container">
      <Link to="/lists/:listId">
      <div className="btn-goback">
        <GoBack />
      </div>
      </Link>
      <div className="chart-title">
        <h1>Gráficos</h1>
      </div>
      <div className="chart-content">
        <div className="chart-name">
          <h2>Filmes assistidos em 2023</h2>
          <p>21/11/2023</p>
        </div>
        <div className="row chart-donut">
          <div className="col-lg-6">
            <BarChart />
          </div>
          <div className="col-lg-6">
            <DonutChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Graphic;
