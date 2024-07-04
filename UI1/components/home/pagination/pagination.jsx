import ReactPaginate from 'react-paginate';
import styles from './pagination.module.css';

const Pagination = ({totalPages,currentPage,handlePageChange,containerClass}) => {
    return (
        <ReactPaginate
            pageCount={totalPages}
            initialPage={currentPage}
            onPageChange={handlePageChange}
            previousLabel={currentPage === 0 ? null : '<'}
            nextLabel={currentPage == totalPages - 1 ? null : '>'}
            breakLabel={'...'}
            activeClassName={styles.active}
            containerClassName={containerClass ? styles[containerClass] : styles.pagination}
            pageClassName={styles.page}
            previousClassName={styles.previous}
            nextClassName={styles.next}
            breakClassName={styles.break}
            disabledClassName={styles.disabled} 
        />
    )
}
export default Pagination