/* Simulate event emitter, in real scenario server wait for load files called by event */
const sleep = (mSeconds: number) =>
  new Promise(resolve => {
    setTimeout(resolve, mSeconds);
  });

/** Transform Array of Array in Object Array
 * @example
 * [[name,surname],['Eric','Ambiel'],['Maria','Cristina']] =>
 * [{name:'Eric',surname:'Ambiel'},{name:'Maria',surname:'Cristina'}] */
const arrayArrayToObjArray = (rows: unknown[][]) => {
  const keys = <[]>rows.shift();
  return rows.map(values => {
    return keys.reduce((preview, current, i) => {
      const newProperty: Record<string, unknown> = {};
      newProperty[current] = values[i];
      return { ...preview, ...newProperty };
    }, {});
  });
};

export { sleep, arrayArrayToObjArray };
