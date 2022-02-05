const passport = require("passport");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");

/**
 * Custom callback function implementation to verify callback from passport
 * - If authentication failed, reject the promise and send back an ApiError object with
 * --- Response status code - "401 Unauthorized"
 * --- Message - "Please authenticate"
 *
 * - If authentication succeeded,
 * --- set the `req.user` property as the user object corresponding to the authenticated token
 * --- resolve the promise
 */

// extract payload from bearer token to check expires
const convertJwtToPayload=(token)=>{
  let payload = token.split(".")[1];
  payload = Buffer.from(payload, 'base64');
  payload = payload.toString('utf-8');
  return JSON.parse(payload);
}

const verifyCallback = (req, resolve, reject) => async (err, user, info) => {

  if (err || info || !user) {   
    return reject(new ApiError(httpStatus.UNAUTHORIZED, "Please  authenticate")); 
  } 
  // checking token is expire or not
  const token = req.headers.authorization.split(" ")[1];
  const payload = convertJwtToPayload(token);
  const currentTime = Math.floor(Date.now() / 1000);

  if(currentTime > payload.expires){
    return reject(new ApiError(httpStatus.UNAUTHORIZED,"User not found")); 
  }

 req.user = user; 
 resolve();
};

/**
 * Auth middleware to authenticate using Passport "jwt" strategy with sessions disabled and a custom callback function
 * 
 */
const auth = () => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    // TODO: CRIO_TASK_MODULE_AUTH - Authenticate request
    passport.authenticate(
      "jwt",
      { session: false },
      verifyCallback(req, resolve, reject)
    )(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

module.exports = auth;
