interface Options {
  /**
   * The maximum amount of times to retry the operation. Default is `10`.
   */
  retries?: number;
  /**
   * The exponential factor to use. Default is `2`.
   */
  factor?: number;
  /**
   * The number of milliseconds before starting the first retry. Default is
   * `1000`.
   */
  minTimeout?: number;
  /**
   * The maximum number of milliseconds between two retries. Default is
   * `Infinity`.
   */
  maxTimeout?: number;
  /**
   * Randomizes the timeouts by multiplying with a factor between 1 to 2.
   * Default is `false`.
   */
  randomize?: boolean;
  /**
   * Trap function that is called in case of an error. Default is `undefined`.
   */
  trap?: (error: any) => any | Promise<any>;
}

const sleep = (ms: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
};

const getTimeOut = (
  minTimeout: number,
  maxTimeout: number,
  factor: number,
  random: number,
  attempt: number,
) => {
  return Math.min(
    Math.round(random * minTimeout * Math.pow(factor, attempt)),
    maxTimeout,
  );
};

/**
 * Return a new retryable version of the given function.
 */
export const wrap = <A extends any[], R>(
  callback: (...args: A) => R,
  {
    retries = 10,
    factor = 2,
    minTimeout = 1_000,
    maxTimeout = Infinity,
    randomize = false,
    trap = undefined,
  }: Options = {},
) => {
  if (minTimeout < 0) {
    throw new Error('minTimeout must not be lower than 0');
  }

  if (maxTimeout < minTimeout) {
    throw new Error('maxTimeout must be greater than minTimeout');
  }

  const random = randomize ? Math.random() + 1 : 1;

  return async (...args: A): Promise<R> | never => {
    let lastError = null;

    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        return await callback(...args);
      } catch (error) {
        if (trap) {
          await trap(error);
        }
        lastError = error;
        await sleep(
          getTimeOut(minTimeout, maxTimeout, factor, random, attempt),
        );
      }
    }

    throw lastError;
  };
};

/**
 * Call the given function applying the given retry strategie.
 */
export const retry = <R>(callback: () => R, options?: Options) => {
  return wrap(callback, options)();
};
