import { inject, injectable } from 'tsyringe';
import IntegrationRepository from '@modules/integration/infra/local/repositories/IntegrationRepository';
import SheetFluigUser, {
  ISheetFluigUser,
} from '@modules/integration/infra/local/models/SheetFluigUser';
import integration from '@config/integration';
import GetSpreadsheetService from '@modules/googleSheets/services/GetSpreadsheetService';
import GetSpreadsheetDetailsService from '@modules/googleSheets/services/GetSpreadsheetDetailsService';
import AuthorizeUserToClientGoogleServer from '@modules/googleSheets/services/AuthorizeUserToClientGoogleServer';
import GoogleUserRepository from '@modules/googleSheets/infra/local/repositories/GoogleUserRepository';
import GoogleClientRepository from '@modules/googleSheets/infra/local/repositories/GoogleClientRepository';
import ConsoleLog from '@libs/ConsoleLog';
import { plainToInstance } from 'class-transformer';
import RegisterUserService from '@modules/fluig/services/RegisterUserService';
import UpdateUserService from '@modules/fluig/services/UpdateUserService';
import CredentialsFluigUserService from '@modules/fluig/services/CredentialsFluigUserService';
import { FluigUserModel } from '@modules/fluig/infra/local/models/FluigUserModel';
import GetUserInformation from '@modules/fluig/services/GetUserInformation';
import GoogleUserInformationModel from '@modules/googleSheets/infra/local/models/GoogleUserInformationModel';
import UpdateFluigUserWithDetails from '@modules/fluig/services/UpdateFluigUserWithDetails';

// TODO: Leave all this in Integration Controller
@injectable()
export default class RegisterNewConnectionsService {
  private readonly integrationConfig = integration();

  constructor(
    @inject(GoogleUserRepository)
    private googleUserRepository: GoogleUserRepository,
    @inject(GoogleClientRepository)
    private googleClientRepository: GoogleClientRepository,
    @inject(IntegrationRepository)
    private repository: IntegrationRepository,
    @inject(GetSpreadsheetService)
    private getSpreadSheetService: GetSpreadsheetService,
    @inject(AuthorizeUserToClientGoogleServer)
    private authorizeUserToClientGoogleServer: AuthorizeUserToClientGoogleServer,
    @inject(GetSpreadsheetDetailsService)
    private getSpreadsheetDetailsService: GetSpreadsheetDetailsService,
    @inject(RegisterUserService)
    private registerUserService: RegisterUserService,
    @inject(UpdateUserService)
    private updateUserService: UpdateUserService,
    @inject(GetUserInformation)
    private getUserInformation: GetUserInformation,
    @inject(CredentialsFluigUserService)
    private credentialsFluigUserService: CredentialsFluigUserService,
    @inject(UpdateFluigUserWithDetails)
    private updateFluigUserWithDetails: UpdateFluigUserWithDetails,
  ) {}

  async execute() {
    const googleUsers = this.googleUserRepository
      .list()
      .map(users => users.user_information);

    const [
      {
        web: { client_id: clientId },
      },
    ] = this.googleClientRepository.list(); // Get first Google Client

    const fluigUsersCredentials = await this.getFluigUsersCredentials(
      googleUsers,
      clientId,
    );

    const fluigUsers = await this.registerAuthorizedFluigUsers(
      fluigUsersCredentials,
    );

    // Update all FluigUser with details
    await Promise.all(
      fluigUsers.map(fluigUser =>
        this.updateFluigUserWithDetails.execute(
          fluigUser.userUUID,
          fluigUser.sub,
        ),
      ),
    );
  }

  getFluigUsersCredentials(
    usersInformation: GoogleUserInformationModel[],
    clientId: string,
  ): Promise<SheetFluigUser[]> {
    return Promise.all(
      usersInformation.map(async userInformation => {
        // Authorize User to use Google Client
        await this.authorizeUserToClientGoogleServer.execute({
          userSUB: userInformation.sub,
          clientId,
        });

        const [{ id }] = await this.getSpreadsheetDetailsService.execute(
          clientId,
          this.integrationConfig.TASK_SPREADSHEET,
        );

        if (!id)
          throw ConsoleLog.print(
            `Can't get spreadsheet from Google User: ${userInformation.sub}`,
            'error',
            'SERVER',
          );

        // Get first fluig credentials from spreadsheet
        const { sheetValues, metadata } = await this.getSpreadSheetService
          .execute(clientId, {
            spreadsheetId: id,
            range: 'Configurações!F2:H3',
          })
          .then(FluigUsers => FluigUsers);

        const [sheet] = sheetValues;

        const fluigUser = plainToInstance(SheetFluigUser, {
          ...sheet,
          metadata,
        });

        fluigUser.metadata.userSub = userInformation.sub;

        // It is already being saved in registerAuthorizedFluigUsers
        // this.repository.save({
        //   googleUserSUB: userInformation.sub,
        // });

        return fluigUser;
      }),
    );
  }

  registerAuthorizedFluigUsers(
    fluigUsersSheet: ISheetFluigUser[],
  ): Promise<FluigUserModel[]> {
    return Promise.all(
      fluigUsersSheet.map(async fluigUserSheet => {
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

        this.repository.save({
          googleUserSUB: fluigUserSheet.metadata.userSub,
          fluigUserUUID: fluigUser.userUUID,
        });

        return fluigUser;
      }),
    );
  }
}
