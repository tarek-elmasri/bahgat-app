import { Request, Response, NextFunction } from "express";
import { Cart, Session, User } from "../entity";
import { sign, verify } from "jsonwebtoken";

type mwFn = (req: Request, res: Response, next: NextFunction) => Promise<void>;

// export interface MyRequest extends Request {
//   session: Session;
//   user?: User;
// }
interface MyCookie {
  id: string; //session id in database
  cartUuid: string;
  access_token?: string;
  refresh_token?: string;
}
/*
--. no cookie? create new session and set cookies
-- > cookie ? --> find session by cookie.id
      --> no session --> create new session with set cookies , next
      --> session ? ---> 
        ---> with accessToken? 
                ---> decode 
                        --> valid decoding -->  find user with userUuid in payload of decoded token
                                                    --> available ? update session access token --> load session and req.user
                                                    --> invalid ? reset current session with no accessToken,refreshToken,Role=guest --> set cookies
                        --> not valid decoding (expired access token)
                            --> find user with session refresh token
                                --> available user? update session access token --> load session and user
                                --> not available? reset current session with no accessToken,refreshToken,role=guest --> setCookies
                                    
        ---> without accessToken?
            --> load session , next
*/

export const sessionBuilder: mwFn = async (req, res, next) => {
  let session: Session | undefined;
  let user: User | undefined;
  const cookie: MyCookie | undefined = req.cookies.sid;

  if (!cookie) {
    session = await createSession(req, res);
    return next();
  }
  //find session by cookie.id
  session = await Session.findOne({ where: { id: cookie.id } });

  // no session in db (** in case deleting all sessions to force logging out)--> create new session
  if (!session) {
    session = await createSession(req, res);
    return next();
  }

  // available session without user --> load session
  if (!session.access_token) {
    req.session = session;
    return next();
  }

  // available session with access token
  // ---> decode token
  const payload = decodeAccessToken(session.access_token);
  if (payload) {
    // successfull accessToken
    user = await User.findOne({
      where: { uuid: payload.userUuid },
      relations: ["authorization"],
    });
    if (user) {
      //update session accessToken ,  setCookies , load session and user , next
      await updateSession(session, user, req, res);
    } else {
      // reset session, set cookies , next (currupted data)
      await resetSession(session, req, res);
    }
  } else {
    //expired access Token --> validate refresh Token match
    user = await User.findOne({
      where: { refresh_token: session.refresh_token },
      relations: ["authorization"],
    });
    if (!user) {
      // user changed password --> no refresh token match
      await resetSession(session, req, res);
    } else {
      //session refreshToken matched user refresh token
      await updateSession(session, user, req, res);
    }
  }
  next();
};

const createSession = async (req: Request, res: Response) => {
  //create new session and cart cart
  const cart = await Cart.create().save();
  const session = await Session.create({
    cartUuid: cart.uuid,
  }).save();
  req.session = session;
  setCookie(session, res);
  return session;
};

const setCookie = (session: Session, res: Response) => {
  res.cookie("sid", {
    id: session.id,
    cartUuid: session.cartUuid,
    access_token: session.access_token,
    refresh_token: session.refresh_token,
  });
};

const decodeAccessToken = (access_token: string): any => {
  return verify(
    access_token,
    process.env.ACCESS_TOKEN_SECRET!,
    (err, decoded) => {
      if (err) return undefined;
      return decoded;
    }
  );
};

const createAccessToken = (data: any) => {
  return sign(data, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: "15m" });
};

export const updateSession = async (
  session: Session,
  user: User,
  req: Request,
  res: Response
) => {
  session.access_token = createAccessToken({ userUuid: user.uuid });
  await session.save();
  setCookie(session, res);
  req.session = session;
  req.user = user;
};

export const createRefreshToken = (data: any) => {
  return sign(data, process.env.REFRESH_TOKEN_SECRET!);
};

export const resetSession = async (
  session: Session,
  req: Request,
  res: Response
) => {
  const cart = await Cart.create().save();
  session.access_token = undefined;
  session.refresh_token = undefined;
  session.cartUuid = cart.uuid;

  await session.save();
  setCookie(session, res);

  req.session = session;
  req.user = undefined;
};
