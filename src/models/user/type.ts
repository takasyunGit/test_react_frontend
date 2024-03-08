// ログイン関係
export type SignUpParams = {
  name: string
  email: string
  password: string
  passwordConfirmation: string
}
export type SignInParams = {
  email: string
  password: string
}

// ユーザー
export type User = {
  id: number
  uid: string
  provider: string
  email: string
  name: string
  image?: string
}

// 認証関係
export type AuthUserContextType = {
  loading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  isSignedIn: boolean
  setIsSignedIn: React.Dispatch<React.SetStateAction<boolean>>
  currentUser: User | undefined
  setCurrentUser: React.Dispatch<React.SetStateAction<User | undefined>>
}