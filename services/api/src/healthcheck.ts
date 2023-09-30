import express from 'express';

export default async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  // if (req.originalUrl === '/r2nano-health-w0Z4t') return res.sendStatus(200); // else
  if (req.headers['user-agent'] === 'ELB-HealthChecker/2.0') {
    res.status(200).end();
    return;
  } else if (req.originalUrl === '/test-4hs7L5Q1q') {
    res.send({test: true});
    return;
  } else {
    next();
  }
};
