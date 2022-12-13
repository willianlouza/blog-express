import { Request, Response } from "express";
import API_Status from "../enum/API_Status";
import { validadePassword } from "../util/validadePassword";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "../../env";
import { User } from "../service/db";

class UserController {
  //Create a new user
  public async SignUp(req: Request, res: Response) {
    try {
      const { username, name, password, confirmPassword } = req.body;

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
          .json({ status: API_Status.ERROR, message: "Senhas não conferem." });
      }

      //* Check if user already exists
      const hasUser = await User.getByUsername(username);
      if (hasUser) {
        return res.status(422).json({
          status: API_Status.ERROR,
          message: "Usuário já existe.",
        });
      }
      //* Generate password hash
      const salt = await bcrypt.genSalt(12);
      const hash = await bcrypt.hash(password, salt);
      const user = await User.createNew({
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

      //* Validate username and password fields
      if (!username || !password) {
        return res.status(422).json({
          status: API_Status.ERROR,
          message: "Usuário e Senha é obrigatório.",
        });
      }

      //* Check if user exists
      const user = await User.getByUsername(username);
      if (!user) {
        return res
          .status(422)
          .json({ status: API_Status.ERROR, message: "Usuário não existe." });
      }

      //* Compare password and generate a token
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
          message: "Erro ao assinar o token.",
        });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ status: API_Status.ERROR, message: "Erro desconhecido." });
    }
  }
  //Update user Name
  public async UpdateProfile(
    req: Request<{ id: number }, {}, { name?: string; icon?: string }, {}>,
    res: Response
  ) {
    try {
      const { name, icon } = req.body;
      const id = req.params.id;

      if (!name && !icon) {
        return res.status(422).json({
          status: API_Status.ERROR,
          message: "Precisa informar o nome e a foto que deseja alterar.",
        });
      }

      console.log("Start update");
      const user = await User.getById(id);

      if (!user) {
        return res.status(422).json({
          status: API_Status.ERROR,
          message: "Usuário não encontrado.",
        });
      }

      if (name && icon) {
        if (name !== user.name && icon !== user.iconUrl) {
          const updatedUser = await User.updateProfile(id, name, icon);
          return res.status(200).json({
            status: API_Status.OK,
            message: "Nome alterado com sucesso.",
            updatedUser,
          });
        }
      } else if (name) {
        if (name !== user.name) {
          const updatedUser = await User.updateName(id, name);
          return res.status(200).json({
            status: API_Status.OK,
            message: "Nome alterado com sucesso.",
            updatedUser,
          });
        }
      } else if (icon) {
        const updatedUser = await User.updateIcon(id, icon);
        return res.status(200).json({
          status: API_Status.OK,
          message: "Nome alterado com sucesso.",
          updatedUser,
        });
      }

      return res.status(500).json({
        status: API_Status.ERROR,
        message: "Erro ao atualizar perfil.",
      });
    } catch (err) {
      return res.status(500).json({
        status: API_Status.ERROR,
        message: "Não foi possível alterar o perfil.",
      });
    }
  }
  //Load user information
  public async GetUser(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const user = await User.getById(parseInt(id));
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
      return res.status(500).json({
        status: API_Status.ERROR,
        message: "Não foi possível encontrar o usuário.",
      });
    }
  }
}

export default new UserController();
