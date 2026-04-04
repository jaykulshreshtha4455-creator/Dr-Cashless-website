/**
 * DR. CASHLESS — api.js
 * Central API config. Update API_BASE after deploying your Railway backend.
 */

// ⚠️  Replace this URL with your actual Railway deployment URL after deploying.
// Example: 'https://dr-cashless-backend.up.railway.app'
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000'
  : 'https://YOUR-RAILWAY-URL.up.railway.app'; // ← UPDATE THIS AFTER DEPLOYING

window.API_BASE = API_BASE;

/**
 * Wrapper around fetch that handles errors and JSON parsing.
 */
window.apiCall = async function(method, path, body) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(API_BASE + path, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
};
