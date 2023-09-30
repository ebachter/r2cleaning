const kIsDefaultInstance = Symbol('is-default-instance');

type SetUpCallback = () =>
  | void
  | CleanUpCallback
  | PromiseLike<void | CleanUpCallback>;
type CleanUpCallback = () => void | PromiseLike<void>;
type PostShutdownCallback = (errors: any[]) => any;

export class Shuttle {
  public [kIsDefaultInstance] = false;

  private setupCallbacks: SetUpCallback[] = [];
  private shutdownCallbacks: CleanUpCallback[] = [];

  private setupPromise?: Promise<boolean>;
  private shutdownPromise?: Promise<any[]>;

  private postShutdownCallback?: PostShutdownCallback;

  /**
   * Register an initialization function, which in turn might return a release
   * function.
   */
  register(callback: SetUpCallback) {
    if (this.setupPromise || this.shutdownPromise) {
      throw new Error(
        'Calling register() after setup() or shutdown() is disallowed',
      );
    } else if (typeof callback !== 'function') {
      throw new TypeError('Invalid parameter (function expected)');
    } else {
      this.setupCallbacks.push(callback);
    }

    return this;
  }

  /**
   * Kick-off all initializer callbacks.
   */
  setup(postShutdownCallback?: PostShutdownCallback) {
    return (this.setupPromise ??= this.doSetup(postShutdownCallback));
  }

  private async doSetup(postShutdownCb?: PostShutdownCallback) {
    if (typeof postShutdownCb === 'function') {
      this.postShutdownCallback = postShutdownCb;
    }

    for (const callback of this.setupCallbacks) {
      if (this.shutdownPromise) {
        return false;
      }

      const result = await Promise.resolve(callback());
      if (typeof result === 'function') {
        this.shutdownCallbacks.push(result);
      }
    }

    return true;
  }

  /**
   * Kick-off all shutdown callbacks.
   */
  shutdown() {
    return (this.shutdownPromise ??= this.doShutdown());
  }

  private async doShutdown() {
    const errors = [];

    for (const callback of this.shutdownCallbacks.reverse()) {
      try {
        await Promise.resolve(callback());
      } catch (error) {
        errors.push(error);
      }
    }

    if (this.postShutdownCallback) {
      this.postShutdownCallback(errors);
    }

    return errors;
  }
}

const instance = new Shuttle();

// Tell the default Shuttle instance that it's the default instance
instance[kIsDefaultInstance] = true;

// Install a shutdown initiator for the default instance
process.once('SIGINT', async () => {
  const errors = await shutdown();
  setImmediate(() => process.exit(errors.length ? 1 : 0));
});

const register = instance.register.bind(instance);
const setup = instance.setup.bind(instance);
const shutdown = instance.shutdown.bind(instance);

export {instance as default, register, setup, shutdown};
