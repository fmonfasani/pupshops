import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto';

interface AuthPayload {
  token: string;
  user: {
    id: number;
    email: string;
    name?: string;
  };
}

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  private buildAuthPayload(user: { id: number; email: string; name?: string }): AuthPayload {
    const token = this.jwt.sign({ sub: user.id, email: user.email });
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    };
  }

  async register(dto: RegisterDto): Promise<AuthPayload> {
    const existing = await this.prisma.findUserByEmail(dto.email);
    if (existing) {
      throw new BadRequestException('El correo electrónico ya está registrado.');
    }
    const user = await this.prisma.createUser({
      email: dto.email,
      password: dto.password,
      name: dto.name
    });

    return this.buildAuthPayload(user);
  }

  async login(dto: LoginDto): Promise<AuthPayload> {
    const user = await this.prisma.validateUser(dto.email, dto.password);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    return this.buildAuthPayload(user);
  }

  async getProfileFromToken(token: string) {
    try {
      const payload = this.jwt.verify<{ sub: number }>(token);
      const user = await this.prisma.findUserById(payload.sub);
      if (!user) {
        throw new UnauthorizedException();
      }
      return { id: user.id, email: user.email, name: user.name };
    } catch (error) {
      throw new UnauthorizedException('Token inválido.');
    }
  }
}
