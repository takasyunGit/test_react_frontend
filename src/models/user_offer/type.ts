export type UserOfferType = {
  id: number,
  userId: number,
  prefecture: number,
  address: string,
  budget: number,
  remark: string,
  requestType: number
  createdAt: string,
  updatedAt: string
}

export type CreateUserOfferParams = Pick<UserOfferType,
  "prefecture" |
  "address" |
  "budget" |
  "remark" |
  "requestType"
> & { images: File[] }

export type ShowUserOfferType = UserOfferType & { name: string, images: { url: string, thumb: { url: string } }[] }