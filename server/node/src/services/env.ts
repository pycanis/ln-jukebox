export const validateEnvironmentVariables = () => {
  const requiredVariables = [
    "FE_ORIGIN",
    "DATABASE_URL",
    "WEBHOOK_SECRET",
    "LN_API",
  ];
  const missingVariables = [];

  for (const variable of requiredVariables) {
    if (!process.env[variable]) {
      missingVariables.push(variable);
    }
  }

  if (missingVariables.length > 0) {
    console.error("The following environment variables are missing:");
    for (const variable of missingVariables) {
      console.error(variable);
    }
    process.exit(1); // Exit the Node.js process with an error code
  }
};

validateEnvironmentVariables();

export const FE_ORIGIN = process.env.FE_ORIGIN as string;
export const DATABASE_URL = process.env.DATABASE_URL as string;
export const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET as string;
export const LN_API = process.env.LN_API as string;
export const PORT = Number(process.env.PORT) ?? 8080;
