import history from '../redux/history';

export function replaceRoute(route: string) {
  history.replace(route);
}
export function pushRoute(route: string) {
  history.push(route);
}
