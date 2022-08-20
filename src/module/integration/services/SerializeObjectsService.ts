import { FormPropertyDTO } from '../../fluig/dtos/FormPropertyDTO';

export default class getParametersForm {
  // execute() {}

  // Parou aqui, levando para serviço!!!
  getFormProperties = (objs: any): FormPropertyDTO[] => {
    const newNameKey = (key: string, idx: number) => `${key}___${idx + 1}`;

    if (Array.isArray(objs))
      return objs
        .map((obj, i, array) =>
          Object.keys(obj).map(key => ({
            name: newNameKey(key, i),
            value: array[i][key],
            // value: `${array[i][key]}`,
          })),
        )
        .flat();

    return Object.keys(objs).map(key => ({
      name: newNameKey(key, 0),
      value: objs[key],
      // value: `${objs[key]}`,
    }));
  };
}
