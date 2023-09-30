import request from 'request';
import log from '@remrob/log';
import {NextFunction, Request, Response} from 'express';

// var passport = require('passport'), TwitterTokenStrategy = require('passport-twitter-token');
// TwitterTokenStrategy =  require('passport-twitter').Strategy;
// User = require('mongoose').model('User'),
// twitterConfig = require('./twitter.config.js');

// module.exports = function () {
module.exports = {
  loadTwitterProfile: (req: Request, res: Response, next: NextFunction) => {
    request.get(
      {
        url: 'https://api.twitter.com/1.1/account/verify_credentials.json',
        qs: {include_entities: false, skip_status: true, include_email: true},
        oauth: {
          consumer_key: process.env.TWITTER_KEY,
          consumer_secret: process.env.TWITTER_SECRET,
          token: res.locals.oauth_token,
          token_secret: res.locals.oauth_token_secret,
        },
        json: true,
      },
      (err, resp, profile) => {
        if (err) {
          log.error(err, 'loadTwitterProfile error');
          // console.log(err2);
        }
        // console.log('resp');
        // console.log(resp);
        // console.log("profile 1 :  ", profile.email, profile.lang);
        // res.status(200).end();
        res.locals.profile = profile;
        next();
      },
    );
  },

  /* passport.use(new TwitterTokenStrategy({
      consumerKey: process.env.TWITTER_KEY,
      consumerSecret: process.env.TWITTER_SECRET,
      includeEmail: true
    },
    function (token, tokenSecret, profile, done) {
      //User.upsertTwitterUser(token, tokenSecret, profile, function(err, user) {
        console.log('---profile---');
        console.log(profile);
        return done(, profile); //err
      //});
    }));*/
};
