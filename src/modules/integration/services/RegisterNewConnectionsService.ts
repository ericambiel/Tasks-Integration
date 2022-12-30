import { inject, injectable } from 'tsyringe';
import IntegrationRepository from '@modules/integration/infra/local/repositories/IntegrationRepository';
import SheetFluigUser, {
  ISheetFluigUser,
} from '@modules/integration/infra/local/models/SheetFluigUser';
import integration from '@config/integration';
import GetSpreadsheetService from '@modules/googleSheets/services/GetSpreadsheetService';
import GetSpreadsheetDetailsService from '@modules/googleSheets/services/GetSpreadsheetDetailsService';
import AuthorizeUserToClientGoogleServerService from '@modules/googleSheets/services/AuthorizeUserToClientGoogleServerService';
import GoogleUserRepository from '@modules/googleSheets/infra/local/repositories/GoogleUserRepository';
import GoogleClientRepository from '@modules/googleSheets/infra/local/repositories/GoogleClientRepository';
import ConsoleLog from '@libs/ConsoleLog';
import { plainToInstance } from 'class-transformer';
import RegisterUserService from '@modules/fluig/services/RegisterUserService';
import CredentialsFluigUserService from '@modules/fluig/services/CredentialsFluigUserService';
import { FluigUserModel } from '@modules/fluig/infra/local/models/FluigUserModel';
import GoogleUserInformationModel from '@modules/googleSheets/infra/local/models/GoogleUserInformationModel';
import UpdateFluigUserWithDetailsService from '@modules/fluig/services/UpdateFluigUserWithDetailsService';
import { GoogleClientCredential } from '@shared/facades/GoogleAPIFacade';

// TODO: Leave all this in Integration Controller

type RegisterModulesConnectionOptions = {
  googleConn: {
    googleUserSUB: GoogleUserInformationModel['sub'];
    googleClientId: GoogleClientCredential['web']['client_id'][];
  };
  fluigConn: { fluigUserUUID: FluigUserModel['userUUID'] };
};
@injectable()
export default class RegisterNewConnectionsService {
  private readonly INTEGRATION_CONFIG = integration();

  constructor(
    @inject(GoogleUserRepository)
    private googleUserRepository: GoogleUserRepository,
    @inject(GoogleClientRepository)
    private googleClientRepository: GoogleClientRepository,
    @inject(IntegrationRepository)
    private repository: IntegrationRepository,
    @inject(GetSpreadsheetService)
    private getSpreadSheetService: GetSpreadsheetService,
    @inject(AuthorizeUserToClientGoogleServerService)
    private authorizeUserToClientGoogleServer: AuthorizeUserToClientGoogleServerService,
    @inject(GetSpreadsheetDetailsService)
    private getSpreadsheetDetailsService: GetSpreadsheetDetailsService,
    @inject(RegisterUserService)
    private registerUserService: RegisterUserService,
    @inject(CredentialsFluigUserService)
    private credentialsFluigUserService: CredentialsFluigUserService,
    @inject(UpdateFluigUserWithDetailsService)
    private updateFluigUserWithDetails: UpdateFluigUserWithDetailsService,
  ) {}

  async execute() {
    const googleUsers = this.googleUserRepository
      .list()
      .map(users => users.user_information);

    // Get first Google Client
    const [
      {
        web: { client_id: clientId },
      },
    ] = this.googleClientRepository.list();

    googleUsers.map(async googleUser => {
      const fluigUserCredentials =
        await this.getFluigUserCredentialsFromGoogleSheet(googleUser, clientId);

      const fluigUser = await this.authenticateFluigUser(fluigUserCredentials);

      await this.updateFluigUserWithDetails.execute(
        fluigUser.userUUID,
        fluigUser.sub,
      );

      this.registerModulesConnection({
        fluigConn: { fluigUserUUID: fluigUser.userUUID },
        googleConn: {
          googleUserSUB: googleUser.sub,
          googleClientId: [clientId],
        },
      });
    });
  }

  private async getFluigUserCredentialsFromGoogleSheet(
    userInformation: GoogleUserInformationModel,
    clientId: string,
  ): Promise<SheetFluigUser> {
    // Authorize User to use Google Client
    await this.authorizeUserToClientGoogleServer.execute({
      userSUB: userInformation.sub,
      clientId,
    });

    const [{ id }] = await this.getSpreadsheetDetailsService.execute(
      clientId,
      this.INTEGRATION_CONFIG.TASK_SPREADSHEET,
    );

    if (!id)
      throw ConsoleLog.print(
        `Can't get spreadsheet from Google User: ${userInformation.sub}`,
        'error',
        'SERVER',
      );

    // Get fluig credentials from spreadsheet
    const { sheetValues, metadata } = await this.getSpreadSheetService.execute<
      Record<string, string | null>
    >(clientId, {
      spreadsheetId: id,
      range: 'Configurações!F2:!H3',
    });

    const fluigUser = plainToInstance(SheetFluigUser, {
      ...[sheetValues], // ...sheetValues[0]
      metadata,
    });

    fluigUser.metadata.userSub = userInformation.sub;

    return fluigUser;
  }

  private async authenticateFluigUser(
    fluigUserSheet: ISheetFluigUser,
  ): Promise<FluigUserModel> {
    // Get Fluig User Credentials
    const { headers, jWTPayload } =
      await this.credentialsFluigUserService.execute(
        fluigUserSheet.username,
        fluigUserSheet.password,
      );

    // Converte Bear JTW to user model
    const fluigUser = plainToInstance(FluigUserModel, jWTPayload);

    // Register fluig user in the system (Repository and Axios)
    this.registerUserService.execute(fluigUser, headers);

    return fluigUser;
  }

  private registerModulesConnection(options: RegisterModulesConnectionOptions) {
    this.repository.save({
      googleUserSUB: options.googleConn.googleUserSUB,
      fluigUserUUID: options.fluigConn.fluigUserUUID,
      googleClientId: options.googleConn.googleClientId,
    });
  }
}
