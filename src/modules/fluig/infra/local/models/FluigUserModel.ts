import { Exclude, Expose } from 'class-transformer';
import { injectable } from 'tsyringe';
import FluigUserInfoModel, {
  IFluigUserInfoModel,
} from '@modules/fluig/infra/local/models/FluigUserInfoModel';
import { JWTFluigPayload } from '@modules/fluig/services/GetAuthorizationFluigUserService';
import { JWTPayloadClaims } from '@shared/helpers/smallHelper';

export interface IFluigUserModel extends JWTFluigPayload {
  sub: JWTPayloadClaims['sub'];
  userInfo?: IFluigUserInfoModel;
}

@Exclude()
@injectable()
export class FluigUserModel implements IFluigUserModel {
  @Expose()
  sub: string;

  @Expose()
  role: string;

  @Expose()
  tenant: number;

  @Expose()
  userTenantId: number;

  @Expose()
  userType: number;

  @Expose()
  userUUID: string;

  @Expose()
  tenantUUID: string;

  @Expose()
  lastUpdateDate: number;

  @Expose()
  userTimeZone: string;

  @Expose()
  userInfo?: FluigUserInfoModel;
}
