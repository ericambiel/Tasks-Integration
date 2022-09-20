import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import ResponseProvider from '@providers/response/ResponseProvider';

// TODO: apply instance manager ResponseContainer
const appResponseContainer = container.createChildContainer();

/**
 * Handle routes not found, by returning a 4004.
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} _next
 */
export default function notFound(
  req: Request,
  res: Response,
  _next: NextFunction,
): Response {
  const appResponse = appResponseContainer.resolve(ResponseProvider);

  const result = {
    ...appResponse
      .setErrors([{ routeNotFound: `Route not found: ${req.originalUrl}` }])
      .setSuccess(false)
      .getProps(),
  };

  appResponseContainer.clearInstances();

  return res.status(404).json(result);
}
