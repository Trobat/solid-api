import { User } from "../../entities/User";
import { IMailProvider } from "../../providers/IMailProvider";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { ICreateUserRequestDTO } from "./CreateUserDTO";

export class CreateUserUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private mailProvider: IMailProvider,
    ) {}
    async execute(data: ICreateUserRequestDTO) {
      const userAlreadyExists = await this.usersRepository.findByEmail(data.email);

      if(userAlreadyExists) {
        throw new Error('User already exists.');
      }

      const user = new User(data);

      await this.usersRepository.save(user);

      await this.mailProvider.sendMail({
        to: {
          name: data.name,
          email: data.email,
        },
        from: {
          name: 'Davi Melo',
          email: 'davi@melo.com'
        },
        subject: 'Olá, venha me conhecer.',
        body: '<p>Meu nome é Davi Melo</p>'
      })
    }
  }
