import { singleton } from 'tsyringe';
import { JWTPayloadGoogleUserDTO } from '@modules/googleSheets/dtos/JWTPayloadGoogleUserDTO';

export type IntegrationConn = {
  googleUserSUB: JWTPayloadGoogleUserDTO['sub'];
  fluigUserUUID: string;
  googleClientId?: string[]; // TODO: Are not populatede in any place
};

@singleton()
export default class IntegrationRepository {
  private readonly integrationConns: IntegrationConn[];

  constructor() {
    this.integrationConns = [];
  }

  find(options: {
    fluigUserUUID: IntegrationConn['fluigUserUUID'];
  }): IntegrationConn | undefined;

  find(options: {
    googleUserSUB: IntegrationConn['googleUserSUB'];
  }): IntegrationConn | undefined;

  find(options: {
    fluigUserUUID: IntegrationConn['fluigUserUUID'];
    googleUserSUB: IntegrationConn['googleUserSUB'];
  }): IntegrationConn | undefined {
    return this.integrationConns.find(
      integrationConn =>
        integrationConn.fluigUserUUID === options.fluigUserUUID ||
        integrationConn.googleUserSUB === options.googleUserSUB,
    );
  }

  list(): IntegrationConn[] {
    return this.integrationConns;
  }

  insert(integrationConn: IntegrationConn): void {
    this.integrationConns.push(integrationConn);
  }

  /**
   * Update if exists, insert if not.
   * @param integrationConn
   * @author Eric Ambiel
   */
  save(integrationConn: IntegrationConn): void {
    const idx = this.integrationConns.findIndex(
      outOfDate =>
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
