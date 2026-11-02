export class HttpError extends Error {
    status;
    code;
    constructor(status, message, code = "error") {
        super(message);
        this.status = status;
        this.code = code;
    }
}
export const badRequest = (msg) => new HttpError(400, msg, "bad_request");
export const notFound = (msg = "Not found") => new HttpError(404, msg, "not_found");
export const conflict = (msg) => new HttpError(409, msg, "conflict");
export const tooMany = (msg = "Too many requests") => new HttpError(429, msg, "rate_limited");
