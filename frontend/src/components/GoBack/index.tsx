import './styles.css';
import { Link } from 'react-router-dom';
import { ReactComponent as ArrowIcon } from 'assets/images/arrow.svg';
const GoBack = () => {
  return (
    <div>
      <Link to="/menu">
        <div className="goback-container">
          <ArrowIcon />
          <h3>VOLTAR</h3>
        </div>
      </Link>
    </div>
  );
};

export default GoBack;
