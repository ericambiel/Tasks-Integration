import { DependencyContainer } from 'tsyringe';
import cloneDeep from 'lodash.clonedeep';

export default abstract class InstanceManagerHelper<T> {
  protected constructor(private container: DependencyContainer) {}

  // TODO: Need to do this function, verify if instance exists
  getInstanceById(instanceId: string): T {
    return this.container.resolve<T>(instanceId);
  }

  /**
   * Clone instance.
   * @param fromInstanceId Instance ID to be found in Axios container
   * @param registerInstanceId New instance ID to be registered on Axios container
   */
  cloneInstance(fromInstanceId: string, registerInstanceId: string): T {
    try {
      const newInstance = cloneDeep(this.container.resolve<T>(fromInstanceId));

      this.container.registerInstance(registerInstanceId, newInstance);

      return newInstance;
    } catch (e) {
      throw new Error('Instance not found in container');
    }
  }

  getContainer() {
    return this.container;
  }
}
