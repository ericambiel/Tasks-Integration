import { Exclude, Expose } from 'class-transformer';
import { ColleagueInformationDTO } from '@modules/fluig/dtos/ColleagueInformationDTO';

export interface IFluigUserInfoModel {
  userName: ColleagueInformationDTO['content']['colleagueName'];
  email: ColleagueInformationDTO['content']['mail'];
  active: ColleagueInformationDTO['content']['active'];
  defaultLanguage: ColleagueInformationDTO['content']['defaultLanguage'];
  dialectId: ColleagueInformationDTO['content']['dialectId'];
}

@Exclude()
export default class FluigUserInfoModel implements IFluigUserInfoModel {
  @Expose({ name: 'colleagueName' })
  userName: string;

  @Expose({ name: 'mail' })
  email: string;

  @Expose()
  active: boolean;

  @Expose()
  defaultLanguage: string;

  @Expose()
  dialectId: string;
}
