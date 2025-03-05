export class UnauthorizedError extends Error {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(message?: string) {
    super("You're not allowed to access this function.");
    this.name = "UnauthorizedError";
  }
}
