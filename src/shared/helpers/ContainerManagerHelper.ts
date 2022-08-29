import { container, DependencyContainer } from 'tsyringe';
import cloneDeep from 'lodash.clonedeep';

export default abstract class ContainerManagerHelper<T> {
  private readonly childContainer: DependencyContainer;

  protected constructor() {
    this.childContainer = container.createChildContainer();
  }

  get container() {
    return this.childContainer;
  }

  /**
   * Clone instance.
   * @param fromInstanceId Instance ID to be found in Axios container
   * @param registerInstanceId New instance ID to be registered on Axios container
   */
  cloneInstance(fromInstanceId: string, registerInstanceId: string): T {
    try {
      const newInstance = cloneDeep(
        this.childContainer.resolve<T>(fromInstanceId),
      );

      this.childContainer.registerInstance(registerInstanceId, newInstance);

      return newInstance;
    } catch (e) {
      throw new Error('Instance not found in container');
    }
  }
}
