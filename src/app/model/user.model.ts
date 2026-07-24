export interface AuthResponseDTO {
  token: string;
}

export interface RegisterUserDTO {
    email: string;
    password: string;
    username: string;
    birthDate: string;
}

export interface LoginCredentialsDTO {
  email: string;
  password: string;
}

export interface UserSummaryDTO {
  userId: number;
  username: string;
}
