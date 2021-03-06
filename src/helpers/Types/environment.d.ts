declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: number | undefined;
    TODOIST_TOKEN: string | undefined;
    FILTER_BUCKET_ID: number | undefined;
    FILTER_ORDER_ID: number | undefined;
    FILTER_ORDER_QUERY: string | undefined;
    DISCORD_TOKEN: string | undefined;
    DISCORD_CHANNEL_NAME: string | undefined;
  }
}
  