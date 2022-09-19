import { CelebrateError } from 'celebrate';
import { IError } from '../erros/BaseError';

export default function parseCelebrateErrorHelper(
  err: CelebrateError,
): IError[] {
  const errors: IError[] = [];
  err.details.forEach(celebrateDetail => {
    celebrateDetail.details.forEach(detail => {
      errors.push({
        [detail.path.toString().replace(',', '.')]: detail.message,
      });
    });
  });

  return errors;
}
