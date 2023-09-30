import * as net from 'net';
import * as http from 'http';
import * as https from 'https';

interface Options {
  /**
   * This values specifies the socket timeout in milliseconds, which is enforced
   * during the initialization of the shutdown process. The default value is
   * `15000` (`15` seconds).
   */
  socketTimeout?: number;
}

export declare type Terminator = () => Promise<void>;

class Counter {
  public value = 0;
}

const isPositiveNumber = (v: unknown): v is number => {
  return typeof v === 'number' && v > 0;
};

export const getTerminator = (
  server: http.Server | https.Server,
  {socketTimeout = 15_000}: Options = {},
): Terminator => {
  if (!isPositiveNumber(socketTimeout)) {
    throw new TypeError('socketTimeout must be a positive number');
  }

  const counterMap = new Map<net.Socket, Counter>();
  let terminationPromise: Promise<void> | undefined;

  server.on('connection', (socket: net.Socket) => {
    if (terminationPromise) {
      socket.destroy();
      return;
    }

    counterMap.set(socket, new Counter());

    socket.on('close', (had_error: string) => {
      counterMap.delete(socket);
    });

    socket.on('timeout', () => {
      socket.end();
    });
  });

  server.on(
    'request',
    (req: http.IncomingMessage, res: http.ServerResponse) => {
      if (terminationPromise) {
        res.writeHead(503);
        res.end();
        return;
      }

      const counter = counterMap.get(req.socket);
      if (counter === undefined) {
        return;
      }

      counter.value += 2;

      const countDown = () => {
        if (--counter.value === 0 && terminationPromise) {
          // Since the termination has already been initiated, we will try to
          // enforce the socket#end event on the occasion.
          req.socket.destroy();
        }
      };

      // Node docs: Emitted when the response has been sent. More specifically,
      //            this event is emitted when the last segment of the response
      //            headers and body have been handed off to the operating
      //            system for transmission over the network. It does not imply
      //            that the client has received anything yet.
      res.on('finish', countDown);

      // Under normal circumstances, the request#end event will be fired right
      // after the response#finish event.
      req.on('end', countDown);

      // Node docs: Indicates that the underlying connection was terminated
      //            before response.end() was called or able to flush.
      //
      // In other words, either the “finish” or “end” event will fire, but never
      // both events together.
      res.on('close', countDown);
    },
  );

  return () => {
    return (terminationPromise ??= new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });

      for (const [socket, counter] of counterMap) {
        if (counter.value === 0) {
          socket.end();
        } else {
          socket.setTimeout(socketTimeout);
        }
      }
    }));
  };
};
