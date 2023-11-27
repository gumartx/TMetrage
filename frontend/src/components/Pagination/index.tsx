import { ReactComponent as ArrowIcon } from 'assets/images/arrow.svg';

import './styles.css';
import ReactPaginate from 'react-paginate';

const Pagination = () => {
    return (
        <ReactPaginate
            pageCount={10}
            marginPagesDisplayed={1}
            pageRangeDisplayed={3}
            containerClassName="pagination-container"
            pageLinkClassName="pagination-item"
            breakClassName="pagination-item"
            previousClassName="arrow-previous"
            nextClassName="arrow-next"
            disabledClassName="arrow-inactive"
            activeLinkClassName="pagination-link-active"
            previousLabel={<ArrowIcon />}
            nextLabel={<ArrowIcon />}
        />
    );
}

export default Pagination;