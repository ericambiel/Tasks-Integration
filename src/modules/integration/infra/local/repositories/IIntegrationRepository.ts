import { JWTPayloadGoogleUserDTO } from '@modules/googleSheets/dtos/JWTPayloadGoogleUserDTO';

export type IntegrationNewConnType = {
  fluigUserUUID: string;
  googleUserSUB: JWTPayloadGoogleUserDTO['sub'];
  googleClientId: string[];
};

export type IntegrationConnType = IntegrationNewConnType & {
  connId: string;
};

/**
 * Repository for connections between modules.
 * @author: Eric Ambiel
 */
export default interface IIntegrationRepository {
  find(options: {
    fluigUserUUID: IntegrationConnType['fluigUserUUID'];
  }): IntegrationConnType | undefined;

  find(options: {
    googleUserSUB: IntegrationConnType['googleUserSUB'];
  }): IntegrationConnType | undefined;

  find(options: {
    fluigUserUUID: IntegrationConnType['fluigUserUUID'];
    googleUserSUB: IntegrationConnType['googleUserSUB'];
  }): IntegrationConnType | undefined;

  /**
   * List all existing connections between modules
   * @author Eric Ambiel
   */
  list(): IntegrationConnType[];

  /**
   * Insert new connection between modules
   * @param integrationConn Informations about modules connections
   * @author Eric Ambiel
   */
  insert(integrationConn: IntegrationNewConnType): void;

  /**
   * Update if exists, insert if not.
   * @param integrationConn
   * @author Eric Ambiel
   */
  save(integrationConn: IntegrationNewConnType): void;
}
