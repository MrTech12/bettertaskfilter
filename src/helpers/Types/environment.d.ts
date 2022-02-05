declare namespace NodeJS {
    export interface ProcessEnv {
      TODOIST_TOKEN: string | undefined;
      FILTER_BUCKET_ID: number | undefined;
      FILTER_ORDER_ID: number | undefined;
      FILTER_ORDER_QUERY: string | undefined;
      DISCORD_TOKEN: string | undefined;
    }
  }
  