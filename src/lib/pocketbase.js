import PocketBase from 'pocketbase';

// 1. Use the .env variable if provided (VITE_POCKETBASE_URL)
// 2. If in production (served directly from pb_public), use the current host origin '/'
// 3. Fall back to local development PocketBase
const PB_URL = import.meta.env.VITE_POCKETBASE_URL || (import.meta.env.PROD ? '/' : 'http://127.0.0.1:8090');

export const pb = new PocketBase(PB_URL);

