const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { ActiveUsersModel } = require('../models/active-users');
const { getParsedSchemaToken } = require('../utils/token');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  //@ts-ignore
  secretOrKey: global.publicKey,
  //@ts-ignore
  algorithms: [global.tokenAlgorithm],
  ignoreExpiration: true,
  passReqToCallback: true,
};

//index.js will pass the global passport object here, and this function will configure it
module.exports = function (passport) {
  // The JWT payload is passed into the verify callback
  passport.use(
    new JwtStrategy(options, async function (req, jwt_payload, cb) {
      let activeUser = null;

      try {
        activeUser = await ActiveUsersModel.findOne(
          { accessToken: getParsedSchemaToken(req) },
          { user: 1 }
        );

        if (!activeUser) return cb(null, false);
      } catch (err) {
        return cb(err, false);
      }

      // @ts-ignore
      activeUser.lastAccessed = new Date();

      try {
        activeUser = await activeUser.save();

        activeUser = activeUser.toObject();

        return cb(null, activeUser.user);
      } catch (err) {
        return cb(err, false);
      }
    })
  );
};
