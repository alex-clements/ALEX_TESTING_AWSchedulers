/// <reference types="vite/client" />
declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_API_URL: string;
    REACT_APP_COGNITO_USER_POOL_ID: string;
    REACT_APP_COGNITO_CLIENT_ID: string;
  }
}
