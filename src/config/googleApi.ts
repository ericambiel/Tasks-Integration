export default (): {
  /** @default src/misc/tokens */
  TOKENS_PATH: string;
  /** @default 'src/misc/clients' */
  CLIENTS_PATH: string;
} => {
  return {
    TOKENS_PATH: process.env.GOOGLE_API_TOKENS_PATH ?? 'src/misc/tokens',
    CLIENTS_PATH: process.env.GOOGLE_API_CLIENTS_PATH ?? 'src/misc/clients',
  };
};
