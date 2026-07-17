export interface UserDetailsDTO {
  userId: number;               
  username: string;
  email: string;
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