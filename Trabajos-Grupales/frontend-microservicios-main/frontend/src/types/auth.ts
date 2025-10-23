export type Role = 'admin' | 'seller' | 'buyer'

export interface LoginDto {
  email: string
  password: string
}

export interface LoginResponse {
  auth: boolean
  token: string
  user: {
    id: string
    name: string
    email: string
    role: Role
  }
}

export interface Me {
  id: string
  name: string
  email: string
  role: Role
}
