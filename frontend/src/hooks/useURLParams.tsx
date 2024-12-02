import { useLocation, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';

export interface IParamUpdate {
  offset: number;
  limit: number;
  name?: string;
  type?: string;
}

interface URLParams {
  params: IParamUpdate;
  updateURLParams: (payload: IParamUpdate) => void;
}

const useURLParams = (defaultLimit: number = 10): URLParams => {
  const location = useLocation();
  const navigate = useNavigate();

  const params = useMemo<IParamUpdate>(() => {
    const searchParams = new URLSearchParams(location.search);

    const offsetParam = searchParams.get('offset');
    const limitParam = searchParams.get('limit');
    const nameParam = searchParams.get('name');
    const typeParam = searchParams.get('type');

    return {
        offset: offsetParam ? parseInt(offsetParam, 10) : 0,
        limit: limitParam ? parseInt(limitParam, 10) : defaultLimit,
        name: nameParam || '',
        type: typeParam || '',
    };
  }, [location.search]);

  const updateURLParams = (updatedParams: IParamUpdate): void => {
    const searchParams = new URLSearchParams(location.search);
    
    (Object.keys(updatedParams) as (keyof IParamUpdate)[]).forEach((key) => {
      if (updatedParams[key]) {
        searchParams.set(key, String(updatedParams[key]));
      } else {
        searchParams.delete(key);
      }
    });

    navigate(`?${searchParams.toString()}`, { replace: true });
  }

  return { params, updateURLParams };
};

export default useURLParams;
