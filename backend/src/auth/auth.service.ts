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
import { InternalAuthResponse } from './types/auth.types';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<InternalAuthResponse> {
    try {
      const { email, name, password } = signUpDto;

      await this.ensureEmailDoesNotExist(email);
      const hashedPassword = await this.hashPassword(password);
      const user = await this.createUser(email, name, hashedPassword);

      this.logger.log(`New user registered: ${email}`);

      return this.createAuthResponse(user);
    } catch (error) {
      this.handleError(error, ConflictException, 'sign up');
    }
  }

  async signIn(signInDto: SignInDto): Promise<InternalAuthResponse> {
    try {
      const { email, password } = signInDto;

      const user = await this.findUserByEmail(email);
      await this.verifyPassword(password, user.password);

      this.logger.log(`User signed in: ${email}`);

      return this.createAuthResponse(user);
    } catch (error) {
      this.handleError(error, UnauthorizedException, 'sign in');
    }
  }

  async validateUser(userId: string): Promise<UserDocument | null> {
    return this.userModel.findById(userId).exec();
  }

  /**
   * Ensures that a user with the given email does not already exist
   * @param email - The email to check
   * @throws ConflictException if the email is already in use
   */
  private async ensureEmailDoesNotExist(email: string): Promise<void> {
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      this.logger.warn(`Sign up attempt with existing email: ${email}`);
      throw new ConflictException('Email already in use');
    }
  }

  /**
   * Hashes a password using bcrypt
   * @param password - The plain text password to hash
   * @returns The hashed password
   */
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Creates a new user in the database
   * @param email - The user's email
   * @param name - The user's name
   * @param hashedPassword - The hashed password
   * @returns The created user document
   */
  private async createUser(
    email: string,
    name: string,
    hashedPassword: string,
  ): Promise<UserDocument> {
    const user = new this.userModel({
      email,
      name,
      password: hashedPassword,
    });
    return user.save();
  }

  /**
   * Finds a user by email address
   * @param email - The email address to search for
   * @returns The user document if found
   * @throws UnauthorizedException if the user is not found
   */
  private async findUserByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      this.logger.warn(`Sign in attempt with non-existent email: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  /**
   * Verifies that a plain text password matches the hashed password
   * @param plainPassword - The plain text password to verify
   * @param hashedPassword - The hashed password to compare against
   * @throws UnauthorizedException if the password does not match
   */
  private async verifyPassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<void> {
    const isPasswordValid = await bcrypt.compare(plainPassword, hashedPassword);
    if (!isPasswordValid) {
      this.logger.warn(`Invalid password attempt`);
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  /**
   * Creates an authentication response with JWT token and user info
   * Token is used by controller to set httpOnly cookie, not returned in response body
   * @param user - The user document
   * @returns Object with access token (for cookie) and user info (for response)
   */
  private createAuthResponse(user: UserDocument): InternalAuthResponse {
    const { access_token } = this.generateToken(user);
    return {
      access_token, // Used internally by controller to set cookie
      user: {
        email: user.email,
        name: user.name,
      },
    };
  }

  /**
   * Generates a JWT token for a user
   * @param user - The user document
   * @returns Object containing the access token
   */
  private generateToken(user: UserDocument): { access_token: string } {
    const payload = { sub: user._id };
    const access_token = this.jwtService.sign(payload);
    return { access_token };
  }

  /**
   * Handles errors by checking if it's an expected exception,
   * logging unexpected errors, and re-throwing
   * @param error - The caught error
   * @param expectedException - The exception type that should be re-thrown without logging
   * @param operation - The operation name for logging (e.g., 'sign up', 'sign in')
   */
  private handleError(
    error: unknown,
    expectedException: new (...args: unknown[]) => Error,
    operation: string,
  ): never {
    if (error instanceof expectedException) {
      throw error;
    }
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    this.logger.error(`Error during ${operation}: ${errorMessage}`, errorStack);
    throw error;
  }
}
