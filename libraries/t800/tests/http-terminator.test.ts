import * as http from 'http';
import {getTerminator, Terminator} from '../src/t800';
import {HttpServerMock} from './utils/http-server-mock';

jest.setTimeout(1000);

describe('t800', () => {
  let server: HttpServerMock;
  let terminate: Terminator;

  beforeEach(() => {
    server = HttpServerMock.create();
    terminate = getTerminator((server as unknown) as http.Server);
    expect(server.on).toHaveBeenCalledWith('connection', expect.any(Function));
    expect(server.on).toHaveBeenCalledWith('request', expect.any(Function));
  });

  describe('when not listening', () => {
    it('should fail to terminate', async () => {
      const termination = terminate();
      expect(server.close).toHaveBeenCalledWith(expect.any(Function));
      await expect(termination).rejects.toThrowError();
    });
  });

  describe('right after starting to listen', () => {
    beforeEach(() => {
      server.listen();
    });

    it('should terminate successfully', async () => {
      const termination = terminate();
      expect(server.close).toHaveBeenCalledWith(expect.any(Function));
      await expect(termination).resolves.toBeUndefined();
    });

    it('should refuse new connections', async () => {
      const r1 = server.fakeRequest();

      server.emit('connection', r1.socket);

      const termination = terminate();
      expect(server.close).toHaveBeenCalledWith(expect.any(Function));

      const r2 = server.fakeRequest();
      server.emit('connection', r2.socket);
      expect(r2.socket.destroy).toHaveBeenCalled();
      expect(r2.socket.on).not.toHaveBeenCalled();

      await expect(termination).resolves.toBeUndefined();
    });
  });

  describe('with pending requests', () => {
    beforeEach(() => {
      server.listen();
    });

    it('should refuse new connections', async () => {
      const r1 = server.fakeRequest();
      server.emit('connection', r1.socket);
      const termination = terminate();

      const r2 = server.fakeRequest();
      server.emit('connection', r2.socket);
      expect(r2.socket.destroy).toHaveBeenCalled();
      expect(r2.socket.on).not.toHaveBeenCalled();

      await expect(termination).resolves.toBeUndefined();
    });
  });
});
