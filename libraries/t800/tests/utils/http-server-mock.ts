import {nextTick} from 'process';

type EventName = string | symbol;
type EventListener = (...args: any[]) => Promise<void> | void;

class FakeEventEmitter {
  private events!: Map<EventName, Set<EventListener>>;

  constructor(...args: any[]) {
    this.events = new Map();
    this.on.bind;
  }

  on(event: EventName, listener: EventListener): this {
    let set = this.events.get(event);

    if (!set) {
      set = new Set();
      this.events.set(event, set);
    }

    set.add(listener);

    return this;
  }

  async emit(event: EventName, ...args: any[]): Promise<boolean> {
    const fns = this.events.get(event);
    if (!fns) {
      return false;
    }

    for (const fn of fns) {
      await fn(...args);
    }

    return true;
  }
}

export class FakeSocket extends FakeEventEmitter {
  ended = false;
  paused = false;
  noDelay = false;
  destroyed = false;

  end() {
    this.emit('close');
    this.ended = true;
  }

  pause() {
    this.paused = true;
    return this;
  }

  setNoDelay(noDelay?: boolean | undefined) {
    this.noDelay = noDelay ?? true;
    return this;
  }

  destroy() {
    this.destroyed = true;
  }

  static create() {
    const instance = new FakeSocket();

    instance.on = jest.fn(instance.on.bind(instance));
    instance.emit = jest.fn(instance.emit.bind(instance));
    instance.end = jest.fn(instance.end.bind(instance));
    instance.pause = jest.fn(instance.pause.bind(instance));
    instance.destroy = jest.fn(instance.destroy.bind(instance));
    instance.setNoDelay = jest.fn(instance.setNoDelay.bind(instance));

    return instance;
  }
}

export class FakeIncomingMessage extends FakeEventEmitter {
  socket!: FakeSocket;

  constructor(socket: FakeSocket) {
    super();
    this.socket = socket;
  }

  static create(socket: FakeSocket) {
    const instance = new FakeIncomingMessage(socket);

    instance.on = jest.fn(instance.on.bind(instance));
    instance.emit = jest.fn(instance.emit.bind(instance));

    return instance;
  }
}

export class FakeServerResponse extends FakeEventEmitter {
  socket!: FakeSocket;
  statusCode?: number;
  ended = false;

  constructor(socket: FakeSocket) {
    super();
    this.socket = socket;
  }

  writeHead(statusCode: number) {
    this.statusCode = statusCode;
    return this;
  }

  end() {
    this.ended = true;
  }

  static create(socket: FakeSocket) {
    const instance = new FakeServerResponse(socket);

    instance.on = jest.fn(instance.on.bind(instance));
    instance.emit = jest.fn(instance.emit.bind(instance));
    instance.writeHead = jest.fn(instance.writeHead.bind(instance));
    instance.end = jest.fn(instance.end.bind(instance));

    return instance;
  }
}

export class HttpServerMock extends FakeEventEmitter {
  listening: boolean = false;

  listen() {
    this.listening = true;
    return this;
  }

  close(callback?: (err?: Error) => void): this {
    if (callback) {
      if (this.listening) {
        nextTick(callback);
      } else {
        nextTick(callback, new Error('Server is not listening'));
      }
    }

    this.listening = false;

    return this;
  }

  fakeRequest() {
    const socket = FakeSocket.create();
    const request = FakeIncomingMessage.create(socket);
    const response = FakeServerResponse.create(socket);

    return {socket, request, response};
  }

  static create() {
    const instance = new HttpServerMock();

    instance.on = jest.fn(instance.on.bind(instance));
    instance.emit = jest.fn(instance.emit.bind(instance));
    instance.listen = jest.fn(instance.listen.bind(instance));
    instance.close = jest.fn(instance.close.bind(instance));

    return instance;
  }
}
