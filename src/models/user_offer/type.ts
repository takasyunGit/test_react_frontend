
export type CreateUserOfferParams = {
  prefecture: number,
  address: string,
  budget: number,
  remark: string,
  request_type: number
}

// ユーザーオファー
export interface UserOffer extends CreateUserOfferParams {
  id: number,
  userId: number,
  createdAt: string,
  updatedAt: string
}
