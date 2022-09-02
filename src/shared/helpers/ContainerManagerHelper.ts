import { container, DependencyContainer } from 'tsyringe';
import cloneDeep from 'lodash.clonedeep';

export default abstract class ContainerManagerHelper {
  private readonly childContainer: DependencyContainer;

  protected constructor() {
    this.childContainer = container.createChildContainer();
  }

  get container() {
    return this.childContainer;
  }

  /**
   * Clone instance.
   * @param fromInstanceId Registered instance ID in childContainer
   * @param registerInstanceId New instance ID to be registered on Axios container
   */
  cloneInstance<T>(fromInstanceId: string, registerInstanceId: string): T {
    try {
      // TODO: Need more tests, used in cloned Axios instance and when calling the function of instance,
      //  return to the function of the "original" one .Use clone from lodash instead of cloneDeep
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
