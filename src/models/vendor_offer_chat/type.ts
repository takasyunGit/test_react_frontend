
export type VendorOfferChatType = {
  id: number,
  userId?: number,
  vendorUserId?: number,
  vendorOfferId: number,
  message: string,
  createdAt: string,
  updatedAt: string
}

export type CreateVendorOfferChatParamsType = Pick<VendorOfferChatType,
    "vendorOfferId" |
    "message"
  >

export type ShowVendorOfferChatType = VendorOfferChatType & {
    name: string,
    avatar: {
      url: string
    }
  }