import express from 'express';
const Base64 = require('js-base64').Base64;
const uuidv4 = require('uuid');
const request = require('request');
// const passport = require('passport');
// const util = require('util');
// const logger = require('./../logger');
import {createUserSessionToken} from '@remrob/utils';
import {prisma} from '@remrob/mysql';

// var passportConfig = require('./socialPassportTwitter');
// const { loadTwitterProfile } = require('./socialTwitter');
// passportConfig();

module.exports = (app: express.Application) => {
  // , DataSchemas
  app.get(
    '/auth/google',
    (req, res: {[key: string]: any}, next) => {
      // console.log('/auth/google');
      // console.log(req.query.code);

      request.post(
        {
          url: 'https://www.googleapis.com/oauth2/v4/token',
          form: {
            code: req.query.code,
            client_id: process.env.GOOGLE_ID,
            client_secret: process.env.GOOGLE_SECRET,
            grant_type: 'authorization_code',
            redirect_uri: 'http://localhost:4000/auth/google/callback',
          },
          json: true,
        },
        async (err: Error, r: any, body: any) => {
          // console.log('---------');
          // console.log('body', err, r.statusCode, r.statusMessage, body);
          // console.log('---------');

          try {
            const segments = body.id_token.split('.');
            if (segments.length !== 3) {
              throw new Error('Not enough or too many segments');
            }

            const [payloadSeg] = segments; // headerSeg,, signatureSeg
            const payload: any = JSON.parse(Base64.decode(payloadSeg));

            // console.log('payload', payload)

            const userData = await prisma.users.findUnique({
              where: {email: payload.email},
            });

            if (!userData) throw new Error('Social signup fetch user error');

            // console.log('--userData--');
            // console.log(userData);
            res.r2data = {};

            if (userData) {
              res.r2data.sessionData = {
                userid: userData.user_id,
                refreshToken: userData.refreshToken,
                language: payload.locale,
              };
            } else {
              const refreshToken = uuidv4();
              const newUser = await prisma.users.create({
                data: {
                  email: payload.email,
                  username: '',
                  name: payload.name,
                  language: 'en',
                  timezone: 'Europe/Berlin',
                  password: payload.password,
                  user_image_hash: 'no_icon',
                  refreshToken,
                },
              });
              if (!newUser.user_id)
                throw new Error('Social signup insert error');

              res.r2data.sessionData = {
                userid: newUser.user_id,
                refreshToken,
                language: payload.locale,
              };
            }
            // console.log('session')
            // console.log(res.r2data.sessionData)

            next();
            // res.status(200).end();
          } catch (err) {
            res.status(500).end();
            next(err);
          }
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

    async (req, res: {[key: string]: any}) => {
      const sessionToken = createUserSessionToken(res.r2data.sessionData);
      // console.log('200 Sending response')
      res
        .json({
          authType: 'google',
          sessionToken,
          refreshToken: res.r2data.refreshToken,
        })
        .end();
    },
  );
};
