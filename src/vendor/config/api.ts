export default (): {
  /** @default 3000 */
  PORT: number;
  /** @default '/api/v1' */
  BASE_URL: string;
  /** @default 'false' */
  SILENT_MODE: boolean;
  DEBUG_LEVEL: Uppercase<string>[];
} => {
  process.env.NODE_DEBUG = process.env.API_DEBUG_LEVEL?.toUpperCase();
  return {
    PORT: Number(process.env.API_REST_PORT ?? 3000),
    BASE_URL: process.env.API_BASE_URL ?? '/api/v1',
    SILENT_MODE: process.env.API_SILENT_MODE?.toUpperCase() === 'TRUE',
    DEBUG_LEVEL: process.env.API_DEBUG_LEVEL?.toUpperCase()?.split(',') ?? [],
  };
};
