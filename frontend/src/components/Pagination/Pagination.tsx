import React from 'react';

interface IProps {
    offset: number;
    limit: number;
    totalPages: number;
    handleFirstPage: () => void;
    handlePreviousPage: () => void;
    handleNextPage: () => void;
    handleLastPage: () => void;
    handleLimitChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

const Pagination = (props: IProps) => {
  const { 
    offset, 
    limit, 
    totalPages, 
    handleFirstPage, 
    handlePreviousPage, 
    handleNextPage, 
    handleLastPage, 
    handleLimitChange 
} = props;

  return (
    <div className="pagination">
        <button onClick={handleFirstPage} disabled={offset === 0}>
          First
        </button>
        <button onClick={handlePreviousPage} disabled={offset === 0}>
          Previous
        </button>
        <span>
          Page {Math.floor((offset / limit) + 1) } of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={offset / 10 === totalPages - 1}>
          Next
        </button>
        <button onClick={handleLastPage} disabled={offset / 10 === totalPages - 1}>
          Last
        </button>

        {/* <select value={limit} onChange={handleLimitChange}>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
        </select> */}
      </div>
  )
}

export default Pagination;
