// ログイン関係
export interface SignUpParams {
  name: string
  email: string
  password: string
  passwordConfirmation: string
}
export interface SignInParams {
  email: string
  password: string
}

// ユーザー
export interface User {
  id: number
  uid: string
  provider: string
  email: string
  name: string
  image?: string
}