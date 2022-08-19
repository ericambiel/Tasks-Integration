/* Simulate event emitter, in real scenario server wait for load files called by event */
import { FormPropertyDTO } from '../../module/fluig/dtos/FormPropertyDTO';

const sleep = (mSeconds: number) =>
  new Promise(resolve => {
    setTimeout(resolve, mSeconds);
  });

/** Transform Array of Array in Object Array
 * @example
 * [[name,surname],['Eric','Ambiel'],['Maria','Cristina']] =>
 * [{name:'Eric',surname:'Ambiel'},{name:'Maria',surname:'Cristina'}] */
const arrayArrayToObjArrayHead = (rows: unknown[][]) => {
  const keys = <[]>rows.shift();
  return rows.map(values =>
    keys.reduce((preview, current, i) => {
      const newProperty: Record<string, unknown> = {};
      newProperty[current] = values[i];
      return { ...preview, ...newProperty };
    }, {}),
  );
};

const stringifyToSlashedJSON = (
  obj: Record<string, unknown> | Record<string, unknown>[],
) => JSON.stringify(obj).replace(/"/g, '\\"');

// Parou aqui, levar o que der para serviço e add ___1, ___20 p/ => name, ex: name: realizadoProjeto___1
const getFormProperties = (
  objs: Record<string, unknown> | Record<string, unknown>[],
) => {
  if (Array.isArray(objs))
    return objs
      .map((obj, i, array) => {
        const keys: string[] = Object.keys(obj);
        return keys.map(
          key => <FormPropertyDTO>{ name: key, value: array[i][key] },
        );
      })
      .flat();
  const keys: string[] = Object.keys(objs);
  return keys.map(key => <FormPropertyDTO>{ name: key, value: objs[key] });
};

export {
  sleep,
  arrayArrayToObjArrayHead,
  stringifyToSlashedJSON,
  getFormProperties,
};
