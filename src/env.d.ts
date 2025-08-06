// Define the type of the environment variables.
declare interface Env {
  readonly NODE_ENV: string;

  readonly API_URL: string;
  readonly NG_APP_API_URL: string;
}

// Use import.meta.env.YOUR_ENV_VAR in your code.
declare interface ImportMeta {
  readonly env: Env;
}
