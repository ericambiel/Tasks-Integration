import { inject, singleton } from 'tsyringe';
import { randomUUID } from 'crypto';
import IIntegrationRepository, {
  IntegrationConnType,
  IntegrationNewConnType,
} from '@modules/integration/infra/local/repositories/IIntegrationRepository';

/**
 * Repository for connections between modules.
 * @author: Eric Ambiel
 */
@singleton()
export default class IntegrationRepository implements IIntegrationRepository {
  // private readonly integrationConns: IntegrationConnType[];
  // constructor() {
  //   this.integrationConns = [];
  // }

  constructor(
    /** Array with registered Fluig users to this API */
    @inject('IntegrationConnType')
    private integrationConns: IntegrationConnType[],
  ) {}

  find(options: {
    fluigUserUUID: IntegrationConnType['fluigUserUUID'];
  }): IntegrationConnType | undefined;

  find(options: {
    googleUserSUB: IntegrationConnType['googleUserSUB'];
  }): IntegrationConnType | undefined;

  find(options: {
    fluigUserUUID: IntegrationConnType['fluigUserUUID'];
    googleUserSUB: IntegrationConnType['googleUserSUB'];
  }): IntegrationConnType | undefined {
    return this.integrationConns.find(
      integrationConn =>
        integrationConn.fluigUserUUID === options.fluigUserUUID ||
        integrationConn.googleUserSUB === options.googleUserSUB,
    );
  }

  /**
   * List all existing connections between modules
   * @author Eric Ambiel
   */
  list(): IntegrationConnType[] {
    return this.integrationConns;
  }

  /**
   * Insert new connection between modules
   * @param integrationConn Informations about modules connections
   * @author Eric Ambiel
   */
  insert(integrationConn: IntegrationNewConnType): void {
    this.integrationConns.push({
      ...integrationConn,
      connId: randomUUID(),
    });
  }

  /**
   * Update if exists, insert if not.
   * @param integrationConn
   * @author Eric Ambiel
   */
  save(integrationConn: IntegrationNewConnType): void {
    const idx = this.integrationConns.findIndex(
      outOfDate =>
        // outOfDate.connId === integrationConn.connId ||
        outOfDate.fluigUserUUID === integrationConn.fluigUserUUID ||
        outOfDate.googleUserSUB === integrationConn.googleUserSUB,
    );

    if (idx === -1) {
      this.insert(integrationConn);
      return;
    }

    this.integrationConns[idx] = {
      ...this.integrationConns[idx],
      ...integrationConn,
    };
  }
}
