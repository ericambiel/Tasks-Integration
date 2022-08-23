import { singleton } from 'tsyringe';
import { FormPropertyDTO } from '../../fluig/dtos/FormPropertyDTO';

/**
 * Convert Google spreadsheet to Workflow Tasks
 */
@singleton()
export default class GoogleSheetToFluigWFTService {
  execute(objs: Record<string, string> | Record<string, string>[]) {
    return this.getFormProperties(objs);
  }

  // Stop here, need to format all object and return to controller sends to Fluig server
  private getFormProperties(
    objs: Record<string, string> | Record<string, string>[],
    options?: { newNameKey: true },
  ): FormPropertyDTO[] {
    const newNameKey = (key: string, idx: number) => `${key}___${idx + 1}`;

    if (Array.isArray(objs))
      return objs
        .map((obj, idx, array) =>
          Object.keys(obj).map(key => ({
            name: options?.newNameKey ? newNameKey(key, idx) : key,
            value: array[idx][<keyof typeof obj>key],
          })),
        )
        .flat();

    return Object.keys(objs).map(key => ({
      name: newNameKey(key, 0),
      // https://bobbyhadz.com/blog/typescript-no-index-signature-with-parameter-of-type-string#:~:text=The%20error%20%22No%20index%20signature,keys%20using%20keyof%20typeof%20obj%20.
      value: objs[<keyof typeof objs>key],
    }));
  }
}
