import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import API_Status from "../enum/API_Status";
import env from "../../env";
type Token = {
  id: number;
  iat: number;
};

export async function auth(
  req: Request<any, any, any, any>,
  res: Response,
  next: NextFunction
) {
  const header = req.headers["authorization"];
  const token = header && header.split(" ")[1];
  const id = req.params.id;

  if (!token) {
    return res
      .status(401)
      .json({ status: API_Status.ERROR, message: "Não autorizado." });
  }

  try {
    const secret = env.TOKEN_SECRET;
    const user = jwt.verify(token, secret) as Token;

    if (user.id !== parseInt(id)) {
      return res
        .status(401)
        .json({ status: API_Status.ERROR, message: "Acesso negado." });
    }

    return next();
  } catch (err) {
    return res
      .status(401)
      .json({ status: API_Status.ERROR, message: "Senha inválida." });
  }
}
