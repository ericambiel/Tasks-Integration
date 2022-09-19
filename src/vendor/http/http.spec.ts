import { Request, Response, Router } from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies
import request from 'supertest';
import * as http from 'http';
import 'reflect-metadata';

import app from '../app';

import { api } from '../config';
import AppError from '../erros/AppError';

describe('HTTP with express', () => {
  let router: Router;
  let server: http.Server;
  const apiConfig = api();

  beforeAll(async () => {
    // Turn off consoleLog - log, debug
    jest.spyOn(console, 'log').mockImplementation(jest.fn());
    jest.spyOn(console, 'debug').mockImplementation(jest.fn());

    router = Router();
    server = await app(router);
  });

  beforeEach(async () => {
    router.get('/exception', (_request: Request, _response: Response) => {
      throw new AppError([AppError.commons.NOT_FOUND]);
    });

    router.get('/format', (_request: Request, response: Response) => {
      return response.json();
    });
  });

  afterAll(() => {
    server.close();
  });

  it('should create a new server', () => {
    expect(server).toBeDefined();
  });

  it('Should return a AppResponse', done => {
    request(server)
      .get(`${apiConfig.BASE_URL}/format`)
      .then(response => {
        expect(response.body).toEqual(
          expect.objectContaining({
            success: true,
            data: {},
            errors: [],
            metadata: {},
          }),
        );
        done();
      });
  });

  it('should properly format exceptions', done => {
    request(server)
      .get(`${apiConfig.BASE_URL}/exception`)
      .then(response => {
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: [AppError.commons.NOT_FOUND],
          }),
        );
        done();
      });
  });

  it('should return 404, when a route is not found', done => {
    request(server)
      .get(`${apiConfig.BASE_URL}/route-that-does-not-exist`)
      .then(response => {
        expect(response.status).toBe(404);
        // expect(response.body).toHaveProperty('errors.[routeNotFound]');
        done();
      });
  });
});
