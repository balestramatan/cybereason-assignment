import { useCallback } from "react";

const DEFAULT_OFFSET = 0;
const DEFAULT_LIMIT = 10;

const usePagination = (
    offset: number, 
    limit: number, 
    totalPages: number, 
    updateURLParams: ({ offset, limit}: { offset: number, limit: number}) => void) => {

    const handleFirstPage = useCallback(() => {
    updateURLParams({ offset: DEFAULT_OFFSET, limit: DEFAULT_LIMIT });
    }, [updateURLParams]);

    const handleLastPage = useCallback(() => {
    updateURLParams({ offset: (totalPages - 1) * limit, limit });
    }, [totalPages, limit, updateURLParams]);

    const handleNextPage = useCallback(() => {
    updateURLParams({ offset: offset + limit, limit });
    }, [offset, limit, updateURLParams]);

    const handlePreviousPage = useCallback(() => {
    updateURLParams({ offset: offset - limit, limit });
    }, [offset, limit, updateURLParams]);

    return {
        handleFirstPage,
        handleLastPage,
        handleNextPage,
        handlePreviousPage,
    };
};

export default usePagination;
  