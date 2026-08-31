import PocketBase from 'pocketbase';

// In production (served from PocketBase pb_public), this uses the current origin.
// In development, fallback to local PocketBase server.
const PB_URL = import.meta.env.PROD ? '/' : 'http://127.0.0.1:8090';

export const pb = new PocketBase(PB_URL);

