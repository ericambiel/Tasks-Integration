export default (): {
  /** @default 3000 */
  PORT: number;
  /** @default '/api/v1' */
  BASE_URL: string;
  /** @default 'false' */
  SILENT: boolean;
  DEBUG_LEVEL: Uppercase<string>[];
} => {
  process.env.NODE_DEBUG = process.env.API_DEBUG_LEVEL?.toUpperCase();
  return {
    PORT: Number(process.env.API_REST_PORT ?? 3000),
    BASE_URL: process.env.API_BASE_URL ?? '/api/v1',
    SILENT: process.env.API_SILENT_MODE === 'enabled',
    DEBUG_LEVEL: process.env.API_DEBUG_LEVEL?.toUpperCase()?.split(',') ?? [],
  };
};
