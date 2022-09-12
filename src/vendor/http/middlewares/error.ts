import { NextFunction, Request, Response } from 'express';
import { CelebrateError, isCelebrateError } from 'celebrate';
import { container } from 'tsyringe';
import { api } from '@configs/*';
import ConsoleLog from '@libs/ConsoleLog';
import parseCelebrateError from '@helpers/parseCelebrateError';
import AppError from '../../erros/AppError';
import ResponseProvider from '../../providers/response/ResponseProvider';

const appResponseContainer = container.createChildContainer();

/**
 * Handles and returns errors to the user.
 *
 * @export
 * @param {any} err
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} _next
 * @returns {Response} JSON or string with error
 */
export default function error(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): Response {
  const apiConfig = api();
  let status: number;
  const appResponse = appResponseContainer.resolve(ResponseProvider);

  if (err instanceof AppError) {
    status = 422;
    appResponse.setSuccess(false).setErrors(err.errors);
  } else if (isCelebrateError(err) || err instanceof CelebrateError) {
    status = 400;
    appResponse.setSuccess(false).setErrors(parseCelebrateError(err));
    // } else if (err instanceof AuthError) {
    //   status = 401;
    //   appResponse.setSuccess(false).setErrors(err.errors);
  } else {
    status = 500;
    appResponse.setSuccess(false);
    appResponse.setErrors([{ [err.name]: err.message }]);
    ConsoleLog.print(err.toString(), 'error', 'ERROR', apiConfig.SILENT);
  }

  const result = appResponse.consume();

  appResponseContainer.clearInstances();

  return res.status(status).json(result);
}
