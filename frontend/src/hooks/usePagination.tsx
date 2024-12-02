import { useCallback } from 'react';
import throttle from 'lodash.throttle';

const usePagination = (
  offset: number,
  limit: number,
  totalPages: number,
  updateURLParams: (params: any) => void
) => {
  const throttledUpdateURLParams = useCallback(
    throttle((newParams) => {
      updateURLParams(newParams);
    }, 300, { trailing: true }),
    [updateURLParams]
  );

  const handleFirstPage = useCallback(() => {
    throttledUpdateURLParams({ offset: 0, limit });
  }, [limit, throttledUpdateURLParams]);

  const handleLastPage = useCallback(() => {
    throttledUpdateURLParams({ offset: (totalPages - 1) * limit, limit });
  }, [limit, totalPages, throttledUpdateURLParams]);

  const handleNextPage = useCallback(() => {
    throttledUpdateURLParams({ offset: offset + limit, limit });
  }, [offset, limit, throttledUpdateURLParams]);

  const handlePreviousPage = useCallback(() => {
    throttledUpdateURLParams({ offset: Math.max(0, offset - limit), limit });
  }, [offset, limit, throttledUpdateURLParams]);

  return {
    handleFirstPage,
    handleLastPage,
    handleNextPage,
    handlePreviousPage,
  };
};

export default usePagination;
