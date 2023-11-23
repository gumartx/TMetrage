import './styles.css';
import { ReactComponent as ArrowIcon } from 'assets/images/arrow.svg';
const GoBack = () => {
  return (
    <div>
        <div className="goback-container">
          <ArrowIcon />
          <h3>VOLTAR</h3>
        </div>
    </div>
  );
};

export default GoBack;
