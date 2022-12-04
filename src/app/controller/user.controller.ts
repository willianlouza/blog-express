import { Request, Response } from "express";
import API_Status from "../enum/API_Status";
import { validadePassword } from "../util/validadePassword";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  CreateUser,
  GetUserById,
  GetUserByUsername,
  UserOptions,
  ChangeUserName,
} from "../service/db/user/user.service";
import { PrismaClient, User } from "@prisma/client";
import env from "../../env";

class UserController {
  //Create a new user
  public async SignUp(req: Request, res: Response) {
    try {
      const { username, name, password, confirmPassword } = req.body;

      //#region Body data validation

      //* Validate name field
      if (!name) {
        return res.status(422).json({
          status: API_Status.ERROR,
          message: "Campo 'nome' é obrigatório.",
        });
      }

      //* Validate username field
      if (!username) {
        return res.status(422).json({
          status: API_Status.ERROR,
          message: "Campo 'usuário' é obrigatório.",
        });
      }
      if (username.length < 3) {
        return res.status(422).json({
          status: API_Status.ERROR,
          message: "Campo 'usuário' precisa conter 3 caracteres ou mais.",
        });
      }

      //* Validate password field
      if (!password) {
        return res.status(422).json({
          status: API_Status.ERROR,
          message: "Campo 'senha' é obrigatório.",
        });
      }
      if (!validadePassword(password)) {
        return res.status(422).json({
          status: API_Status.ERROR,
          message:
            "A senha precisa conter pelo menos 8 caracteres, 1 número e 1 letra maiúscula.",
        });
      }
      if (password !== confirmPassword) {
        return res
          .status(422)
          .json({ status: API_Status.ERROR, message: "Senhas não combinam." });
      }

      //#endregion

      //* Check if user already exists
      const hasUser = await GetUserByUsername(username);

      if (hasUser) {
        return res.status(422).json({
          status: API_Status.ERROR,
          message: "Usuário já existe.",
        });
      }

      //* Generate password hash
      const salt = await bcrypt.genSalt(12);
      const hash = await bcrypt.hash(password, salt);

      const user = await CreateUser({
        username,
        password: hash,
        name,
      });

      return res
        .status(201)
        .json({ status: API_Status.OK, message: "Usuário criado.", user });
    } catch (err) {
      res
        .status(500)
        .json({ status: API_Status.ERROR, message: "Erro ao criar usuário." });
    }
  }
  //Login user
  public async SignIn(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(422).json({
          status: API_Status.ERROR,
          message: "Precisa informar usuário e senha.",
        });
      }

      const user = await GetUserByUsername(username);
      if (!user) {
        return res
          .status(422)
          .json({ status: API_Status.ERROR, message: "Usuário não existe." });
      }

      //* Compare password and create token
      const checkPassword = await bcrypt.compare(password, user.password);
      if (!checkPassword) {
        return res
          .status(422)
          .json({ status: API_Status.ERROR, message: "Senha inválida." });
      }
      try {
        const secret = env.TOKEN_SECRET;
        const token = jwt.sign(
          {
            id: user.id,
          },
          secret,
          {
            expiresIn: "1d",
          }
        );
        return res.status(200).json({
          status: API_Status.OK,
          message: "Acesso autorizado.",
          token,
          user,
        });
      } catch (err) {
        return res.status(500).json({
          status: API_Status.ERROR,
          message: "Erro ao entrar com token.",
        });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ status: API_Status.ERROR, message: "Erro desconhecido." });
    }
  }
  //Update user Name
  public async UpdateName(req: Request, res: Response) {
    try {
      const { newName } = req.body;
      const id = req.params.id;

      if (!newName) {
        return res.status(422).json({
          status: API_Status.ERROR,
          message: "Precisa informar o nome que deseja alterar.",
        });
      }

      const user = await GetUserById(parseInt(id));
      if (!user) {
        return res.status(422).json({
          status: API_Status.ERROR,
          message: "Usuário não encontrado.",
        });
      }

      const updatedUser = await ChangeUserName(parseInt(id), newName);

      return res.status(200).json({
        status: API_Status.OK,
        message: "Nome alterado com sucesso.",
        updatedUser,
      });
    } catch (err) {
      return res.status(500).json({
        status: API_Status.ERROR,
        message: "Não foi possível alterar o nome.",
      });
    }
  }

  //Load user information
  public async GetUser(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const user = await GetUserById(parseInt(id));
      if (!user) {
        return res.status(404).json({
          status: API_Status.ERROR,
          message: "Usuário não encontrado.",
        });
      }

      return res
        .status(200)
        .json({ status: API_Status.OK, message: "Usuário encontrado.", user });
    } catch (err) {
      return res
        .status(500)
        .json({
          status: API_Status.ERROR,
          message: "Não foi possível encontrar o usuário.",
        });
    }
  }
}

export default new UserController();
