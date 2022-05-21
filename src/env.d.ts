declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: string;
    APP_SECRET: string;
    DATABASE_URL: string;
  }
}
