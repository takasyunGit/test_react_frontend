
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
    "message" |
    "createdAt"
  > & { signInType: "User" | "Vendor" }

export type ShowVendorOfferChatType = VendorOfferChatType & { name: string}