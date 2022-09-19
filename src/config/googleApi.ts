export default (): {
  /** @default src/misc/clients */
  GOOGLE_API_TOKENS_PATH: string;
  /** @default 'src/misc/clients' */
  GOOGLE_API_CLIENTS_PATH: string;
} => {
  return {
    GOOGLE_API_TOKENS_PATH:
      process.env.GOOGLE_API_TOKENS_PATH ?? 'src/misc/tokens',
    GOOGLE_API_CLIENTS_PATH:
      process.env.GOOGLE_API_CLIENTS_PATH ?? 'src/misc/clients',
  };
};
