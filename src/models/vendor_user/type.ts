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
  avatar?: {
    url: string
  }
}

// 認証関係
export type AuthVendorUserContextType = {
  loadingVendor: boolean
  setLoadingVendor: React.Dispatch<React.SetStateAction<boolean>>
  isSignedInVendor: boolean
  setIsSignedInVendor: React.Dispatch<React.SetStateAction<boolean>>
  currentVendorUser: VendorUser | undefined
  setCurrentVendorUser: React.Dispatch<React.SetStateAction<VendorUser | undefined>>
}