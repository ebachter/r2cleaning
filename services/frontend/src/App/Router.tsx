import {FC, useLayoutEffect, useState} from 'react';
import {Router} from 'react-router-dom';
import {BrowserHistory, MemoryHistory} from 'history';

/* interface CustomRouterProps
  extends Omit<RouterProps, 'location' | 'navigator'> {
  history: MemoryHistory;
} */

type Props = {
  basename?: string;
  children: React.ReactNode;
  history: BrowserHistory;
};
export const CustomRouter: FC<Props> = ({basename, children, history}) => {
  const [state, setState] = useState<
    Pick<MemoryHistory, 'action' | 'location'>
  >({
    action: history.action,
    location: history.location,
  });

  useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <Router
      basename={basename}
      children={children}
      location={state.location}
      navigationType={state.action}
      navigator={history}
    />
  );
};
