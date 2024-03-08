// ログイン関係
export interface SignInParams {
  email: string
  password: string
}

// ベンダー
export interface VendorUser {
  id: number
  vendor_id: number
  uid: string
  provider: string
  email: string
  name: string
  image?: string
}

// 認証関係
export type AuthVendorContextType = {
  loading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  isSignedIn: boolean
  setIsSignedIn: React.Dispatch<React.SetStateAction<boolean>>
  currentVendorUser: VendorUser | undefined
  setCurrentVendorUser: React.Dispatch<React.SetStateAction<VendorUser | undefined>>
}