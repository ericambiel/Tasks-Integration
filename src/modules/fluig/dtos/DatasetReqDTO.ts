export type DatasetReqDTO = {
  /** Function name of Dataset functions to call at Fluig */
  name: string;
  fields: null;
  constraints: [
    {
      /** Fields to search */
      _field: string;
      /** Value to search */
      _initialValue: string;
      /** Value to search */
      _finalValue: string;
      _type: number;
    },
  ];
  order: null;
};
