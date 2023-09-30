import {useParams} from 'react-router-dom';
import invariant from 'ts-invariant';
import {AllRouterParams, allRouterParamsSchema} from '../router/routes';

/**
 * A hook to typecheck and null check useParams.
 * We do this because react-router can never be sure of where we are calling useParams from.
 * Even if we are sure IN THIS MOMENT, in the future, a route component could be deleted or a param name could change
 * This gives us a test for that case
 */
export default function useTypedParams<T extends keyof AllRouterParams>(
  parameterNames: T[],
): Record<T, AllRouterParams[T]> {
  const params = useParams();
  const typedParams: Record<string, AllRouterParams[T]> = {};
  parameterNames.forEach((paramName) => {
    const currentParam = params[paramName];
    invariant(
      currentParam,
      `${paramName} not found in useParams. Check the parent route to make sure nothing changed`,
    );
    const newValue = allRouterParamsSchema.shape[paramName].parse(
      currentParam,
    ) as AllRouterParams[T];

    typedParams[paramName] = newValue;
  });
  return typedParams;
}
