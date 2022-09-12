export default (): {
  /** @default '*' */
  ORIGINS: string | string[];
  /** @default 200 */
  SUCCESS_CODE: number;
} => {
  return {
    ORIGINS: process.env.CORS_ORIGINS?.split(',') ?? '*',
    SUCCESS_CODE: Number(process.env.CORS_SUCCESS_CODE ?? 200),
  };
};
