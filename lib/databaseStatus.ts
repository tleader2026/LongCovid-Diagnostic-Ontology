export type DatabaseStatus = {
  available: boolean;
  message?: string;
};

export function databaseUnavailableMessage(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes("PRISMA_DATABASE_URL") || error.message.includes("DATABASE_URL")) {
      return "PRISMA_DATABASE_URL is not configured for this deployment.";
    }

    if (error.message.includes("does not exist in the current database")) {
      return "The database is reachable, but its tables have not been created or seeded.";
    }

    return error.message;
  }

  return "The database is not available.";
}
