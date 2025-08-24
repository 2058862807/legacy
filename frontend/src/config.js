// CRA reads only REACT_APP_* at build time
export const API_BASE = process.env.REACT_APP_API_BASE_URL || "";
export const STRIPE_PK = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || "";
export const AUTH0_DOMAIN = process.env.REACT_APP_AUTH0_DOMAIN || "";
export const AUTH0_CLIENT_ID = process.env.REACT_APP_AUTH0_CLIENT_ID || "";
