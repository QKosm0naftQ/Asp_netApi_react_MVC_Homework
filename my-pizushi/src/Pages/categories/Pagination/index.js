import React from 'react';
import classNames from 'classnames';

const CategoryPagination = ({
    currentPage,
    totalPages,
    onPageChange,
    itemsPerPage,
    totalItems
    }) => {
    // Створюємо масив сторінок для відображення
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <nav aria-label="Categories pagination" className="mt-4">
            <ul className="pagination justify-content-center">
                <li className={classNames('page-item', {
                    disabled: currentPage === 1
                })}>
                    <button
                        className="page-link"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Попередня
                    </button>
                </li>

                {pages.map(page => (
                    <li key={page} className={classNames('page-item', {
                        active: page === currentPage
                    })}>
                        <button
                            className="page-link"
                            onClick={() => onPageChange(page)}
                        >
                            {page}
                        </button>
                    </li>
                ))}

                <li className={classNames('page-item', {
                    disabled: currentPage === totalPages
                })}>
                    <button
                        className="page-link"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Наступна
                    </button>
                </li>
            </ul>
            <div className="text-center mt-2">
                <small className="text-muted">
                    Показано {Math.min(currentPage * itemsPerPage, totalItems)} з {totalItems} категорій
                </small>
            </div>
        </nav>
    );
};

export default CategoryPagination;