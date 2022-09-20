import mung from 'express-mung';
import { container } from 'tsyringe';
import ResponseProvider from '@providers/response/ResponseProvider';

// TODO: apply instance manager to ResponseContainer
const appResponseContainer = container.createChildContainer();

const success = mung.json(function transform(
  body: Record<string, unknown> | Record<string, unknown>[],
) {
  const appResponse = appResponseContainer.resolve(ResponseProvider);

  if (Array.isArray(body) && !('total' in appResponse.metadata))
    appResponse.setMetadata({ ...appResponse.metadata, total: body.length });

  return appResponse.setData(body || {}).getProps();
});

appResponseContainer.clearInstances();

export default success;
