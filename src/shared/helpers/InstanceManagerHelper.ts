import { container } from 'tsyringe';

export default class InstanceManagerHelper {
  // TODO: Need to do this function, verify if instance exists
  static getInstanceById<ClassName>(instanceId: string): ClassName {
    return container.resolve<ClassName>(instanceId);
  }
}
