export type UserOfferType = {
  id: number,
  userId: number,
  prefecture: number,
  address: string,
  budget: number,
  remark: string,
  requestType: number
  deadline: string
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

export type ShowUserOfferType = UserOfferType & {
  name: string,
  userName: string,
  avatar: {
    url: string
  }
  images: {
    url: string,
    thumb: { url: string }
  }[]
}