export const __producation__ = process.env.NODE_ENV === "production";

export const OTP_EXPIRATION_MINS = 1000 * 60 * 10; // 10 mins
export const OTP_REQUEST_INTERVAL = 1000 * 15; // 15 sec
export const MSEGAT_USERNAME = process.env.MSEGAT_USERNAME;
export const MSEGAT_API_KEY = process.env.MSEGAT_API_KEY;
