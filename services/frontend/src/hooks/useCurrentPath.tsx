import {matchRoutes, useLocation} from 'react-router-dom';
import {allRoutesArray} from '../router/routes';

const useCurrentPath = () => {
  const location = useLocation();
  const [{route}] = matchRoutes(allRoutesArray, location) ?? [];

  return route; //.path as keyof AllRoutes;
};

export default useCurrentPath;
