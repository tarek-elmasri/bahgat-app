import { Request, Response, NextFunction } from "express";
import { Cart, Session, User } from "../entity";
import { sign, verify } from "jsonwebtoken";
import { getConnection } from "typeorm";

type mwFn = (req: Request, res: Response, next: NextFunction) => Promise<void>;

interface MyCookie {
  id: string; //session id in database
  cartId: string;
  access_token?: string;
  refresh_token?: string;
}
interface setSessionParams {
  session: Session;
  user?: User;
  cart?: Cart;
  req: Request;
}
type setSessionFn = (params: setSessionParams) => Promise<void>;
type UpdateSessionFn = (
  session: Session,
  user: User,
  req: Request,
  res: Response
) => Promise<void>;
/*
Builder schema:
--. no cookie? create new session and set cookies
-- > cookie ? --> find session by cookie.id
      --> no session --> create new session with set cookies , next
      --> session ? ---> 
        ---> with accessToken? 
                ---> decode 
                        --> valid decoding -->  find user with userUuid in payload of decoded token
                                                    --> available ?  --> load session and req.user
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
    console.log("no session i database");
    return next();
  }

  // available session without user --> load session
  if (!session.access_token) {
    await setSession({ session, req });
    return next();
  }

  // available session with access token
  // ---> decode token
  const payload = decodeAccessToken(session.access_token);
  if (payload) {
    // successfull accessToken
    user = await User.findOne({
      where: { id: payload.userId },
    });
    if (user) {
      //set session and user objects in req
      await setSession({ session, user, req });
    } else {
      // delete and create new session ==>  next (currupted data)
      await deleteSession(session);
      await createSession(req, res);
    }
  } else {
    //expired access Token --> validate refresh Token match
    user = await User.findOne({
      where: { refresh_token: session.refresh_token },
    });
    if (!user) {
      // user changed password --> no refresh token match
      await deleteSession(session);
      await createSession(req, res);
    } else {
      //session refreshToken matched user refresh token
      await updateSession(session, user, req, res);
    }
  }
  next();
};

const loadCart = async (id: string) => {
  const cart = await Cart.findOne({ where: { id } });
  if (!cart) throw new Error("internal error , no cart");

  return cart;
};

const setSession: setSessionFn = async ({ session, user, cart, req }) => {
  req.session = session;
  req.user = user;
  req.cart = cart || (await loadCart(session.cartId));
};

const createSession = async (req: Request, res: Response) => {
  //create new session and cart cart
  const cart = await Cart.create().save();
  const session = await Session.create({
    cartId: cart.id,
  }).save();
  await setSession({ req, session, cart });
  setCookie(session, res);
  return session;
};

const setCookie = (session: Session, res: Response) => {
  res.cookie("sid", {
    id: session.id,
    cartId: session.cartId,
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

export const updateSession: UpdateSessionFn = async (
  session,
  user,
  req,
  res
) => {
  session.access_token = createAccessToken({ userId: user.id });
  session.refresh_token = user.refresh_token;
  await session.save();
  await setSession({ session, user, req });
  setCookie(session, res);
};

export const createRefreshToken = (data: any) => {
  return sign(data, process.env.REFRESH_TOKEN_SECRET!);
};

export const deleteSession = async (session: Session) => {
  await getConnection().getRepository(Session).delete(session);
};
