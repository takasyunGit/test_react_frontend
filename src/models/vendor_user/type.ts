// ログイン関係
export type SignInParams = {
  email: string
  password: string
}

// ベンダー
export type VendorUser = {
  id: number
  vendor_id: number
  uid: string
  provider: string
  email: string
  name: string
  image?: string
}

// 認証関係
export type AuthVendorUserContextType = {
  loading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  isSignedIn: boolean
  setIsSignedIn: React.Dispatch<React.SetStateAction<boolean>>
  currentVendorUser: VendorUser | undefined
  setCurrentVendorUser: React.Dispatch<React.SetStateAction<VendorUser | undefined>>
}