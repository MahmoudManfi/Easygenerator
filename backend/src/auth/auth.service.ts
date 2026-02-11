import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../schemas/user.schema';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ access_token: string }> {
    try {
      const { email, name, password } = signUpDto;

      // Check if user already exists
      const existingUser = await this.userModel.findOne({ email });
      if (existingUser) {
        this.logger.warn(`Sign up attempt with existing email: ${email}`);
        throw new ConflictException('User with this email already exists');
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user
      const user = new this.userModel({
        email,
        name,
        password: hashedPassword,
      });
      await user.save();

      this.logger.log(`New user registered: ${email}`);

      // Generate JWT token
      const payload = { sub: user._id, email: user.email };
      const access_token = this.jwtService.sign(payload);

      return { access_token };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Error during sign up: ${errorMessage}`, errorStack);
      throw error;
    }
  }

  async signIn(signInDto: SignInDto): Promise<{ access_token: string }> {
    try {
      const { email, password } = signInDto;

      // Find user
      const user = await this.userModel.findOne({ email });
      if (!user) {
        this.logger.warn(`Sign in attempt with non-existent email: ${email}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        this.logger.warn(`Invalid password attempt for email: ${email}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      this.logger.log(`User signed in: ${email}`);

      // Generate JWT token
      const payload = { sub: user._id, email: user.email };
      const access_token = this.jwtService.sign(payload);

      return { access_token };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Error during sign in: ${errorMessage}`, errorStack);
      throw error;
    }
  }

  async validateUser(userId: string): Promise<UserDocument | null> {
    return this.userModel.findById(userId).exec();
  }
}
