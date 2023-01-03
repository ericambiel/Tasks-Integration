// eslint-disable-next-line camelcase
import { drive_v3 } from 'googleapis';

export default interface IGetWorkbookDetailsService {
  execute(
    clientId: string,
    worksheetName: string,
  ): // eslint-disable-next-line camelcase
  Promise<drive_v3.Schema$File[]>;
}
