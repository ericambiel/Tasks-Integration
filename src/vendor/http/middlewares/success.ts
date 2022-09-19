import { Request, Response } from 'express';
import mung from 'express-mung';
import { container } from 'tsyringe';
import ResponseProvider from '../../providers/response/ResponseProvider';

const success = mung.json(function transform(
  body: Record<string, unknown> | Record<string, unknown>[],
  _req: Request,
  _res: Response,
) {
  const appResponse = container.resolve(ResponseProvider);
  if (Array.isArray(body) && !('total' in appResponse.metadata)) {
    appResponse.setMetadata({ ...appResponse.metadata, total: body.length });
  }
  return appResponse.setData(body || {}).getProps();
});

export default success;
