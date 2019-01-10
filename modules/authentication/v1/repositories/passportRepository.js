

const passport = require('passport');
const passportLocal = require('passport-local');
const passportJWT = require('passport-jwt')
const User = require('../models/UserModel');
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const LocalStrategy = passportLocal.Strategy;

passport.use(new LocalStrategy({usernameField: "uniqueIndentifier", passwordField: "password"},
     (uniqueIndentifier, password, cb) => {
        // this one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT
        return User.findOne({uniqueIndentifier})
            .then((user) => {
                if (!user) {
                    return cb(undefined, false, {message: "Incorrect email or password."});
                }

                user.comparePassword(password,  user.password, (err, isMatch) => {
                    if (err) { return cb(err); }
                    console.log(user.password)
                    if (isMatch) {
                        if (user.accountVerified) {
                            return cb(undefined, user, {message: "Logged In Successfully"});
                        }
                        return cb(undefined, false, { message: "Account has not been verified, please register again" });
                    }
                    return cb(undefined, false, { message: "Invalid email or password." });
                });

            })
            .catch(err => cb(err));
    }
));

passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey   : process.env.SESSION_SECRET
    },
    function (jwtPayload, cb) {
        // find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
        return cb(undefined, jwtPayload);
    }
));
