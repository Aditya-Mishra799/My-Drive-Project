import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Table.module.css';

const Table = ({ columns, data, currentPage, totalPages, onPageChange, loading }) => {
    const handlePrevPage = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    if (loading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    if (!data || data.length === 0) {
        return <div className={styles.empty}>No data available</div>;
    }

    return (
        <div className={styles.tableContainer}>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            {columns.map((column, index) => (
                                <th key={index} style={{ width: column.width }}>
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {columns.map((column, colIndex) => (
                                    <td key={colIndex}>
                                        {column.render ? column.render(row) : row[column.accessor]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className={styles.paginationButton}
                    >
                        <ChevronLeft size={18} />
                        Previous
                    </button>
                    <span className={styles.pageInfo}>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className={styles.paginationButton}
                    >
                        Next
                        <ChevronRight size={18} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default Table;
