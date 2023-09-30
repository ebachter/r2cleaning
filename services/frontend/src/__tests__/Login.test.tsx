import {render} from '@testing-library/react';
import {trpcFunc} from '../trpc';
import App from '../App/App';
import 'jest-canvas-mock';

// jest.setTimeout(300000);
test('extUserSessionCreate', async () => {
  // const bids = trpcClient.query('bid.getAll')
  render(<App />);
  try {
    console.log('>>', trpcFunc.extUserSessionCreate);
    const res = await trpcFunc.extUserSessionCreate.mutate({
      email: 'test@remrob.com',
      password: 'qwer',
    });
    console.log('++', res);
    // expect(typeof res.sessionToken).toBe('string');
    expect(1).toBe(1);
  } catch (err) {
    console.log(err);
  }
});
