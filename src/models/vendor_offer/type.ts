
export type VendorOfferType = {
  id: number,
  vendorUserId: number,
  userOfferId: number,
  estimate: number,
  remark: string,
  createdAt: string,
  updatedAt: string
}

export type CreateVendorOfferParams = Pick<VendorOfferType,
    "userOfferId" |
    "estimate" |
    "remark"
  >

export type ShowVendorOfferType = VendorOfferType & { name: string}