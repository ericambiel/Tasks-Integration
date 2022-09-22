export default (): {
  /** @default 'https://unknown.com' */
  BASEURL: string;
  /**  @default https://unknown.com/ */
  ORIGIN: string;
} => {
  return {
    BASEURL: process.env.FLUIG_BASEURL ?? 'https://unknown.com',
    ORIGIN: process.env.FLUIG_ORIGIN ?? 'https://unknown.com/',
  };
};
