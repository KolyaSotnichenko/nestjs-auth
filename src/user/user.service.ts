import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { genSalt, hash } from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...data } = user;

    return {
      data,
    };
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(id: string, dto: UpdateUserDto) {
    const user = await this.findById(id);

    const isSameUser = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (isSameUser && String(id) !== String(isSameUser.id)) {
      throw new NotFoundException('Email busy');
    }

    if (dto.password) {
      const salt = await genSalt(10);

      await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          email: dto.email,
          isAdmin: (dto.isAdmin || dto.isAdmin === false) && dto.isAdmin,
          password: await hash(dto.password, salt),
        },
      });
    }

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        email: dto.email,
        isAdmin: (dto.isAdmin || dto.isAdmin === false) && dto.isAdmin,
      },
    });
  }
}
