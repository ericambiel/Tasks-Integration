import { Expose } from 'class-transformer';
import { injectable } from 'tsyringe';

export interface IFluigUserModel {
  sub: string;
  role: string;
  tenant: number;
  userTenantId: number;
  userType: number;
  userUUID: string;
  tenantUUID: string;
  lastUpdateDate: number;
  userTimeZone: string;
}

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
}
