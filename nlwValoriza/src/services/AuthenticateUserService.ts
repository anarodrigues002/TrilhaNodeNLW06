import { getCustomRepository } from "typeorm"

import { compare } from "bcryptjs"

import { sign } from "jsonwebtoken"

import { UsersRepositories } from "../repositories/UsersRepositories"


interface IAuthenticateRequest{
    email: string;
    password: string;
}

class AuthenticateUserService {

    async execute({email,password}: IAuthenticateRequest) {

        const usersRepository = getCustomRepository(UsersRepositories);

        //Verificar se email existe
        const user = await usersRepository.findOne({
            email
        });

        if(!user) {
            throw new Error("Email/Password incorrect");
        }

        //Vertificar se senha está correta
        const passwordMatch = await compare(password, user.password) 

        if(!passwordMatch) {
            throw new Error("Email/Password incorrect");
        }

        //Gerar Token
        const token = sign(
          {
            email: user.email            
          }, 
          "3c20feafab398dffe4201b6cbd35facd", 
          {
            subject: user.id,
            expiresIn: "1d"
          }
        );
        
        return token;
    }
}

export { AuthenticateUserService }