import {handler as myHandler} from './lambda_terminations';

export const handler = async () => {
  // Your code here
  console.log('-- main handler --');
  const result = await myHandler();
  return result;
};
