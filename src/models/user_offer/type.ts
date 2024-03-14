
export type CreateUserOfferParams = {
  prefecture: number,
  address: string,
  budget: string,
  remark: string,
  request_type: number
}

// ユーザーオファー
export interface UserOffer extends CreateUserOfferParams {
  created_at?: string,
  updated_at?: string
}
