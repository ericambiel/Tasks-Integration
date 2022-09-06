/**
 * Simulate event emitter, in real scenario server wait for load files called by event
 * @author Eric Ambiel
 */
export const sleep = (mSeconds: number) =>
  new Promise(resolve => {
    setTimeout(resolve, mSeconds);
  });

/**
 * Transform Array of Array in Object Array
 * @author Eric Ambiel
 * @example
 * [[name,surname],['Eric','Ambiel'],['Maria','Cristina']] =>
 * [{name:'Eric',surname:'Ambiel'},{name:'Maria',surname:'Cristina'}]
 */
export function arrayArrayToObjArrayHead(
  rows: unknown[][],
  options?: { undefinedTo: number | string | boolean | null },
) {
  const keys = <[]>rows.shift();
  return rows.map(values =>
    keys.reduce((preview, current, i) => {
      const newProperty: Record<string, unknown> = {};
      newProperty[current] = values[i] ? values[i] : options?.undefinedTo;
      return { ...preview, ...newProperty };
    }, {}),
  );
}

// const stringifyToSlashedJSON = (
//   obj: Record<string, unknown> | Record<string, unknown>[],
// ) => JSON.stringify(obj).replace(/"/g, '\\"');

/**
 * Extract payload from given JWT
 * @param jWT
 * @private
 * @author Eric Ambiel
 */
export function extractPayloadFromJWT<T>(jWT: string): T {
  // Convert JWT Token to payload
  const jWTSplit = jWT.split('.')[1];
  const decodedJWTSplit = Buffer.from(jWTSplit, 'base64').toString();
  return <T>JSON.parse(decodedJWTSplit);
}

/**
 * @param enm
 * @param value
 * @author Eric Ambiel
 */
export function stringToEnum<T>(
  enm: { [s: string]: T },
  value: string,
): T | undefined {
  if ((Object.values(enm) as unknown as string[]).includes(value))
    return value as unknown as T;
  return undefined;
}

/**
 * Group array by same predicate
 * @param array Array to be used for grouping
 * @param predicate Predicate define de condition to grouping
 * @author https://stackoverflow.com/questions/14446511/most-efficient-method-to-groupby-on-an-array-of-objects
 */
export function groupByPredicate<T>(
  array: T[],
  predicate: (value: T, idx: number, arr: T[]) => string,
) {
  return array.reduce((acc, value, idx, arr) => {
    (acc[predicate(value, idx, arr)] ||= []).push(value);
    return acc;
  }, {} as { [key: string]: T[] });
}
