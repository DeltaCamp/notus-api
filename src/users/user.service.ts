import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

import { generateRandomBytes } from '../utils/generateRandomBytes';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async create(email): Promise<User> {
    const userEntity = new User();

    userEntity.email = email;
    userEntity.confirmation_code = await generateRandomBytes();

    return await this.userRepository.save(userEntity);
  }

  async findOrCreate(email): Promise<User> {
    try {
      let user = await this.userService.findOne({ email });

      if (!user) {
        user = await this.createUser(email);
      }

      return user;
    } catch(err) {
      console.error(err)
      return err
    }
  }

  async confirm(confirmationCode, email): Promise<User> {
    return new Promise(() => { })

    // const userEntity = await this.userRepository.findOne({
    //   confirmation_code: confirmationCode,
    //   email
    // });

    // if (userEntity === undefined) {
    //   return new User()
    // } else {
    //   userEntity.confirmed = true;
    //   return await this.userRepository.save(userEntity);
    // }
  }
  
}