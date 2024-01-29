import Cookies from 'js-cookie';

const STR_SIZE = 64;
const clientId = process.env.REACT_APP_CLIENT_ID;
const redirectUri = process.env.REACT_APP_REDIRECT_URI;

/* Using the code verifier and code generated from the first part of the PKCE
   authentication process to request a temporary access token from Spotify.
*/
export const getToken = async (code, fromRefresh = false) => {
  let codeVerifier = localStorage.getItem('code_verifier');
  if (!codeVerifier) return;

  const url = new URL("https://accounts.spotify.com/api/token");
  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: !fromRefresh 
          ? new URLSearchParams({
              client_id: clientId,
              grant_type: 'authorization_code',
              code: code,
              redirect_uri: redirectUri,
              code_verifier: codeVerifier,
            }) 
          : new URLSearchParams({
            client_id: clientId,
            grant_type: 'refresh_token',
            refresh_token: Cookies.get('refresh_token')
          })
  }

  try {
    const body = await fetch(url, payload);
    const response = await body.json();
    Cookies.set('token', response.access_token, { expires: new Date(new Date().getTime() + response.expires_in * 1000), secure: true });
    Cookies.set('refresh_token', response.refresh_token, { expires: 7, secure: true });
  } catch (error) {
    console.error('Error fetching access token:', error);
  }
}

/* Authenticates Spotify user with Spotify API's PKCE authentication, offloading
   the authentication workload to Spotify's servers. Response is an access
   token.
*/
export const codeChallenge = async () => {
  // Complete code challenge
  const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
  }
  
  const sha256 = async (plain) => {
    const encoder = new TextEncoder()
    const data = encoder.encode(plain)
    return window.crypto.subtle.digest('SHA-256', data)
  }
  
  const base64encode = (input) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }
  
  const codeVerifier = generateRandomString(STR_SIZE);
  const hashed = await sha256(codeVerifier)
  const codeChallenge = base64encode(hashed);

  // Send request with encoded challenge to get access token
  const scope = 'user-read-private user-read-email';
  const authUrl = new URL("https://accounts.spotify.com/authorize")

  // generated in the previous step
  window.localStorage.setItem('code_verifier', codeVerifier);

  const params =  {
    response_type: 'code',
    client_id: clientId,
    scope,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    redirect_uri: redirectUri,
  }

  authUrl.search = new URLSearchParams(params).toString();
  window.location.href = authUrl.toString();
}
