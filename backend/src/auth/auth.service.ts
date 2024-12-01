import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto, LoginUserDto } from './dtos/auth-user.dto';

@Injectable()
export class AuthService {
    constructor(
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
      private readonly jwtService: JwtService,
    ) {}
  
    async register(registerUserDto: RegisterUserDto): Promise<User> {
      const { email, password } = registerUserDto;

      // Check if user already exists
      const existingUser = await this.userRepository.findOne({ where: { email } });
      if (existingUser) {
        throw new ConflictException('A user with this email already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = this.userRepository.create({
        email,
        password: hashedPassword,
      });
  
      try {
        return await this.userRepository.save(newUser);
      } catch (error) {
        console.error('Error saving user:', error);
        throw new ConflictException('Could not register user. Please try again later.');
      }
    }
  
    async validateUser(email: string, password: string): Promise<User | null> {
      const user = await this.userRepository.findOne({ where: { email } });

      if (!user) {
        throw new NotFoundException('Invalid email or password');
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid email or password');
      }

      return user;
    }

    async login(user: LoginUserDto) {
        const signedUpUser = await this.userRepository.findOne({ where: { email: user.email } });

        if (!signedUpUser) {
          throw new NotFoundException('User not found');
        }

        const payload = { email: user.email, sub: signedUpUser.id };

        try {
          return {
            access_token: this.jwtService.sign(payload),
          };
        } catch (error) {
          console.error('Error generating token:', error);
          throw new UnauthorizedException('Could not log in. Please try again later.');
        }
    }
}
