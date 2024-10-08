import {Request, Response, NextFunction} from 'express';
import {verifyUserAuthToken} from '../authentication';

interface UserAuthInfoRequest extends Request {
  token: string; // or any other type
}

export const checkRoute = (req: Request, res: Response, next: NextFunction) => {
  const reqTemp = req as UserAuthInfoRequest;
  // console.info({ info: '--- route protection ---' })
  if (!reqTemp.token) {
    // res.send({ valid: false });
    // res.status(501);
    res.status(401);
  }

  const decodedData = verifyUserAuthToken(reqTemp.token);
  // console.log('decodedData - valid', decodedData)
  if (decodedData) {
    res.locals = {...decodedData};
    next();
  } else {
    res.status(401).end();
    return;
  }
};
