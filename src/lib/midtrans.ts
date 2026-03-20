// Midtrans Snap configuration — server-side only.

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY!
const IS_PRODUCTION = process.env.NODE_ENV === 'production'

export const MIDTRANS_BASE_URL = IS_PRODUCTION
  ? 'https://app.midtrans.com/snap/v1'
  : 'https://app.sandbox.midtrans.com/snap/v1'

export const MIDTRANS_SNAP_URL = IS_PRODUCTION
  ? 'https://app.midtrans.com/snap/snap.js'
  : 'https://app.sandbox.midtrans.com/snap/snap.js'

export const MIDTRANS_CLIENT_KEY = process.env.MIDTRANS_CLIENT_KEY!

const authString = Buffer.from(MIDTRANS_SERVER_KEY + ':').toString('base64')

export const midtransHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  Authorization: `Basic ${authString}`,
}

// Prices are in @/lib/limits.ts (shared client/server)
export { STARTER_PLAN_PRICE, FULL_PLAN_PRICE } from './limits'
