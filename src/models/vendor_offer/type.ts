
export type VendorOffer = {
  id: number,
  vendorUserId: number,
  userOfferId: number,
  estimate: number,
  remark: string,
  createdAt: string,
  updatedAt: string
}

export type CreateVendorOfferParams = Pick<
    VendorOffer,
    "userOfferId" |
    "estimate" |
    "remark"
  >

export type ShowVendorOffer = VendorOffer & { name: string}