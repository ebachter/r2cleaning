import express from 'express';
const uuidv4 = require('uuid');
const request = require('request');
import {prisma} from '@remrob/mysql';
import log from '@remrob/log';
import {createUserSessionToken} from '@remrob/utils';

// var passportConfig = require('./socialPassportTwitter');
const {loadTwitterProfile} = require('./socialTwitter');
// passportConfig();

//// LOGIN.js
/*const nextAuthProviders = require('../next-auth.providers')();*/

/* const createToken = function(auth) {
  return jwt.sign({
    id: auth.id
  }, 'my-secret',
  {
    expiresIn: 60 * 120
  });
};*/

/* const generateToken = function (req, res, next) {
  req.token = createToken(req.auth);
  return next();
};*/

/* const sendToken = function (req, res) {
  res.setHeader('x-auth-token', req.token);
  return res.status(200).send(JSON.stringify(req.user));
};*/

module.exports = (app: express.Application) => {
  // , DataSchemas
  app.route('/auth/twitter/reverse').post((req, res, next) => {
    request.post(
      {
        url: 'https://api.twitter.com/oauth/request_token',
        oauth: {
          oauth_callback: 'http://localhost:4000/auth/oauth/twitter/callback',
          consumer_key: process.env.TWITTER_KEY, // 'KEY',
          consumer_secret: process.env.TWITTER_SECRET, // 'SECRET'
        },
      },
      (err: {[key: string]: any}, r: any, body: any) => {
        if (err) {
          next(err);
          return res.status(500).send({message: err.message});
        }

        const jsonStr =
          '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
        res.send(JSON.parse(jsonStr));
      },
    );
  });

  app.get(
    '/auth/twitter',
    (req, res, next) => {
      // console.log('/auth/twitter');
      // console.log('oauth_token', req.query.oauth_token);
      // console.log('oauth_verifier', req.query.oauth_verifier);

      request.post(
        {
          url: 'https://api.twitter.com/oauth/access_token?oauth_verifier',
          oauth: {
            consumer_key: process.env.TWITTER_KEY,
            consumer_secret: process.env.TWITTER_SECRET,
            token: req.query.oauth_token,
          },
          form: {oauth_verifier: req.query.oauth_verifier},
        },
        (err: any, r: any, body: any) => {
          if (r.statusCode !== 200) {
            res.status(r.statusCode).send({body}).end();
            return;
          }
          if (err) {
            // console.log('error', err);
            return res.status(500).send({message: err.message});
          }

          const bodyString =
            '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
          const parsedBody = JSON.parse(bodyString);

          // req.body['oauth_token'] = parsedBody.oauth_token;
          // req.body['oauth_token_secret'] = parsedBody.oauth_token_secret;
          // req.body['user_id'] = parsedBody.user_id;
          res.locals.oauth_token = parsedBody.oauth_token;
          res.locals.oauth_token_secret = parsedBody.oauth_token_secret;
          // res.locals['user_id'] = parsedBody.user_id;

          next();
        },
      );
    } /*passport.authenticate('twitter-token', {session: false}), function(req, res, next) {
      console.log('--passport--')
      if (!req.user) {
        return res.send(401, 'User Not Authenticated');
      }

      // prepare token for API
      req.auth = {
        id: req.user.id
      };

      return next();
}, generateToken, sendToken*/,
    loadTwitterProfile,
    async (req, res: {[key: string]: any}, next) => {
      // console.log('--PROFILE--')
      // console.log(res.locals.profile)
      try {
        await prisma.$transaction(async (tx) => {
          // const language = 'en'; // (req.cookies && req.cookies.lang) ? ||
          const timezone = 'Europe/Berlin';

          const userData = await tx.users.findFirst({
            select: {
              user_id: true,
              password: true,
              language: true,
            },
            where: {
              email: res.locals.profile.email,
            },
          });
          // console.log('select length', usersRes.length);
          // console.log('select res', usersRes);
          // const [userData] = usersRes;
          const refreshToken = uuidv4();

          res.r2data = {refreshToken};

          if (userData) {
            res.r2data.sessionData = {
              userid: userData.user_id,
              language: userData.language,
            };
          } else {
            const insertUser = await tx.users.create({
              data: {
                email: res.locals.profile.email,
                username: res.locals.profile.name,
                name: '',
                // lastname: '',
                language: res.locals.profile.lang,
                timezone: timezone,
                refreshToken,
                user_image_hash: 'no_icon.png',
              },
            });

            // res.locals.profile.email, '', '', res.locals.profile.lang, timezone, uuid.v4()

            // console.log('insertRes.insertId', insertRes);
            if (!insertUser.user_id) {
              throw new Error('Signup insert error');
              return;
            }

            await tx.$executeRaw`
              UPDATE r2db.users SET refreshToken = ${refreshToken} WHERE userid = ${insertUser.user_id}
            `;

            res.r2data.sessionData = {
              userid: insertUser.user_id,
              language: res.locals.profile.lang,
            };
          }
          // console.log('###', res.r2data)
          next();
        });
      } catch (err) {
        log.error({err}, 'connection error');
        res.status(500);
        await prisma.$disconnect();
        next(err);
      }
    },
    async (req, res: {[key: string]: any}) => {
      // console.log('final')
      // console.log(res.r2data.sessionData, res.r2data.refreshToken)
      const sessionToken = createUserSessionToken(res.r2data.sessionData);
      // console.log('200 Sending response')
      res
        .json({
          authType: 'twitter',
          sessionToken,
          refreshToken: res.r2data.refreshToken,
        })
        .end();
    },
  );
};
