
export type VendorOfferType = {
  id: number,
  vendorUserId: number,
  userOfferId: number,
  title: string,
  estimate: number,
  remark: string,
  createdAt: string,
  updatedAt: string
}

export type CreateVendorOfferParams = Pick<VendorOfferType,
    "userOfferId" |
    "title" |
    "estimate" |
    "remark"
  >

export type ShowVendorOfferType = VendorOfferType & { name: string}