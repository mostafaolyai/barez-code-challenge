import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../entities/user.entity';
import { UserRole } from '../../enums/user-role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(user: User): Promise<User> {
    const existingUser = await this.findByUsername(user.username);
    if (existingUser) {
      throw new ConflictException(`there is user with username`);
    }

    user.password = await bcrypt.hash(user.password, 10);

    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(currentUser: User, id: number): Promise<User> {
    console.log(
      currentUser.id,
      id,
      currentUser.role === UserRole.ADMIN,
      currentUser.id === id || currentUser.role === UserRole.ADMIN,
    );
    if (
      Number(currentUser.id) === Number(id) ||
      currentUser.role === UserRole.ADMIN
    )
      return this.userRepository.findOne({
        where: { id },
      });

    return null;
  }

  async findById(id: number): Promise<User> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  async update(currentUser: User, id: number, user: User): Promise<User> {
    const existingUser = await this.findOne(currentUser, id);
    if (!existingUser) {
      throw new NotFoundException(`user not found`);
    }

    const isUpdatingSelf = Number(currentUser.id) === Number(id);
    const isAdmin = currentUser.role !== UserRole.USER;

    if (!isUpdatingSelf && !isAdmin)
      throw new ConflictException(`you haven't access to update`);

    user.password = await bcrypt.hash(user.password, 10);
    Object.assign(existingUser, user);

    return this.userRepository.save(existingUser);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async findByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({
      where: { username },
    });
  }

  async seed() {
    const defaultUser = await this.findByUsername(process.env.DEFAULT_USERNAME);
    if (!defaultUser) {
      const user: User = {
        username: process.env.DEFAULT_USERNAME,
        password: await bcrypt.hash(process.env.DEFAULT_PASSWORD, 10),
        role: UserRole.ADMIN,
      };
      await this.userRepository.save(user);
    }
  }
}
