const crypto = require("crypto");

const AUTH_COOKIE_NAME = "auth_token";
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const getSecret = () => process.env.SESSION_SECRET || "fallback-secret-key";

const base64UrlEncode = (value) =>
  Buffer.from(value, "utf8").toString("base64url");

const base64UrlDecode = (value) =>
  Buffer.from(value, "base64url").toString("utf8");

const signPayload = (payloadB64) =>
  crypto
    .createHmac("sha256", getSecret())
    .update(payloadB64)
    .digest("base64url");

const safeJsonParse = (value) => {
  try {
    return JSON.parse(value);
  } catch (err) {
    return null;
  }
};

const issueAuthToken = (user) => {
  if (!user || !user.id) {
    return null;
  }

  const payload = {
    id: user.id,
    username: user.username,
    role: user.role,
    exp: Date.now() + ONE_DAY_MS,
  };

  const payloadB64 = base64UrlEncode(JSON.stringify(payload));
  const signature = signPayload(payloadB64);
  return `${payloadB64}.${signature}`;
};

const verifyAuthToken = (token) => {
  if (!token || typeof token !== "string" || !token.includes(".")) {
    return null;
  }

  const [payloadB64, signature] = token.split(".");
  if (!payloadB64 || !signature) {
    return null;
  }

  const expectedSignature = signPayload(payloadB64);
  if (signature !== expectedSignature) {
    return null;
  }

  const payloadJson = base64UrlDecode(payloadB64);
  const payload = safeJsonParse(payloadJson);

  if (!payload || !payload.exp || Number(payload.exp) < Date.now()) {
    return null;
  }

  return {
    id: payload.id,
    username: payload.username,
    role: payload.role,
  };
};

const authCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: ONE_DAY_MS,
});

const setAuthCookie = (res, user) => {
  const token = issueAuthToken(user);
  if (!token) {
    return;
  }

  res.cookie(AUTH_COOKIE_NAME, token, authCookieOptions());
};

const clearAuthCookie = (res) => {
  res.clearCookie(AUTH_COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
};

const restoreUserFromAuthCookie = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }

  const token = req.cookies ? req.cookies[AUTH_COOKIE_NAME] : null;
  const user = verifyAuthToken(token);

  if (user && req.session) {
    req.session.user = user;
  }

  next();
};

module.exports = {
  setAuthCookie,
  clearAuthCookie,
  restoreUserFromAuthCookie,
};
