export interface UserResponse {
  email: string;
  name: string;
}

/**
 * Internal authentication response with token and user info
 * Used by AuthService to return both token (for cookie) and user data
 */
export interface InternalAuthResponse {
  access_token: string;
  user: UserResponse;
}
