import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dtos/auth-user.dto';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    validateUser: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call register with correct parameters', async () => {
      const registerUserDto: RegisterUserDto = { email: 'test@example.com', password: 'password', repeatPassword: 'repeatPassword' };
      await controller.register(registerUserDto);
      expect(service.register).toHaveBeenCalledWith(registerUserDto);
    });
  });

  describe('login', () => {
    it('should call validateUser and login with correct parameters', async () => {
      const body = { email: 'test@example.com', password: 'password' };
      const user = { id: 1, email: 'test@example.com' };
      (service.validateUser as jest.Mock).mockResolvedValue(user);
      (service.login as jest.Mock).mockResolvedValue({ access_token: 'token' });

      const result = await controller.login(body);
      expect(service.validateUser).toHaveBeenCalledWith(body.email, body.password);
      expect(service.login).toHaveBeenCalledWith(user);
      expect(result).toEqual({ access_token: 'token' });
    });

    it('should throw UnauthorizedException if validateUser returns null', async () => {
      const body = { email: 'test@example.com', password: 'password' };
      (service.validateUser as jest.Mock).mockResolvedValue(null);

      await expect(controller.login(body)).rejects.toThrow(UnauthorizedException);
    });
  });
});