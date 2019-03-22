import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './UserEntity';

import { generateRandomBytes } from '../utils/generateRandomBytes';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) { }

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async create(email): Promise<UserEntity> {
    const userEntity = new UserEntity();

    userEntity.email = email;
    userEntity.confirmation_code = await generateRandomBytes();

    return await this.userRepository.save(userEntity);
  }

  async findOrCreate(email): Promise<UserEntity> {
    try {
      let user = await this.userRepository.findOne({ email });

      if (!user) {
        user = await this.create(email);
      }

      return user;
    } catch(err) {
      console.error(err)
      return err
    }
  }

  async confirm(confirmationCode, email): Promise<UserEntity> {
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