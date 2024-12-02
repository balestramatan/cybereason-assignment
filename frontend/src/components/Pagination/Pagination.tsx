interface IProps {
    offset: number;
    limit: number;
    totalPages: number;
    handleFirstPage: () => void;
    handlePreviousPage: () => void;
    handleNextPage: () => void;
    handleLastPage: () => void;
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
} = props;

  return (
    <div className="pagination">
        <button onClick={handleFirstPage} disabled={offset === 0}>
          <span>{'<<'}</span>
        </button>
        <button onClick={handlePreviousPage} disabled={offset === 0}>
          <span>{'<'}</span>
        </button>
        <span>
          {Math.floor((offset / limit) + 1) } of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={offset / 10 === totalPages - 1}>
          <span>{'>'}</span>
        </button>
        <button onClick={handleLastPage} disabled={offset / 10 === totalPages - 1}>
          <span>{'>>'}</span>
        </button>
      </div>
  )
}

export default Pagination;
