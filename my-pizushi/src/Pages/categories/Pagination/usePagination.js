import { useState, useMemo } from 'react';

export const usePagination = (items, itemsPerPage = 5) => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(items.length / itemsPerPage);

    // Отримуємо поточні елементи для відображення
    const currentItems = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return items.slice(start, end);
    }, [items, currentPage, itemsPerPage]);

    // Обробник зміни сторінки
    const handlePageChange = (pageNumber) => {
        // Перевіряємо чи сторінка в допустимих межах
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            // Прокручуємо сторінку вгору при зміні сторінки
            window.scrollTo(0, 0);
        }
    };

    return {
        currentPage,
        totalPages,
        currentItems,
        itemsPerPage,
        totalItems: items.length,
        handlePageChange
    };
};