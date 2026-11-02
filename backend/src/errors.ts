export class HttpError extends Error {
  constructor(public status: number, message: string, public code = "error") {
    super(message);
  }
}
export const badRequest = (msg: string) => new HttpError(400, msg, "bad_request");
export const notFound = (msg = "Not found") => new HttpError(404, msg, "not_found");
export const conflict = (msg: string) => new HttpError(409, msg, "conflict");
export const tooMany = (msg = "Too many requests") => new HttpError(429, msg, "rate_limited");