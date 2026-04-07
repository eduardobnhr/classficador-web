import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/models/dtos/users/create-user.dto';
import { UpdateUserDto } from 'src/models/dtos/users/update-user.dto';
import { User } from 'src/models/entities/user.entity';
import { Repository } from 'typeorm';
import { GenerateException } from '../../../commons/exceptions/generateExceptionError';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usuarioRepository: Repository<User>,
  ) { }

  async create(createUsuarioDto: CreateUserDto): Promise<User> {
    const { email, password, name, role, is_active } = createUsuarioDto;

    const existing = await this.usuarioRepository.findOneBy({ email });
    if (existing) {
      throw new ConflictException('E-mail já cadastrado.');
    }

    const salt = await bcrypt.genSalt();
    const hashedSenha = await bcrypt.hash(password, salt);

    const usuario = this.usuarioRepository.create({
      name,
      email,
      password_hash: hashedSenha,
      role,
      is_active,
    });

    return this.usuarioRepository.save(usuario);
  }

  findAll(): Promise<User[]> {
    return this.usuarioRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
      relations: ['carteiras'],
    });

    if (!usuario) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }

    return usuario;
  }

  async findOneByEmail(email: string) {
    try {
      return this.usuarioRepository.findOne({
        where: { email },
      })
    } catch (error) {
      GenerateException(error)
    }
  }

  async update(id: string, updateUsuarioDto: UpdateUserDto): Promise<User> {
    const usuario = await this.findOne(id);

    if (updateUsuarioDto.password) {
      const salt = await bcrypt.genSalt();
      usuario.password_hash = await bcrypt.hash(updateUsuarioDto.password, salt);
    }

    Object.assign(usuario, updateUsuarioDto);
    delete updateUsuarioDto.password;

    return this.usuarioRepository.save(usuario);
  }

  async remove(id: string): Promise<void> {
    const usuario = await this.findOne(id);
    await this.usuarioRepository.remove(usuario);
  }
}