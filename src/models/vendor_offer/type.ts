
export type VendorOfferType = {
  id: number,
  vendorUserId: number,
  userOfferId: number,
  title: string,
  estimate: number,
  remark: string,
  createdAt: string,
  updatedAt: string
  images: {
    url: string,
    thumb: { url: string }
  }[]
}

export type CreateVendorOfferParams = Pick<VendorOfferType,
    "userOfferId" |
    "title" |
    "estimate" |
    "remark"
  >

export type UpdateVendorOfferParams = Pick<VendorOfferType,
  "id" |
  "estimate" |
  "remark"
>

export type ShowVendorOfferType =
  VendorOfferType & {
    name: string,
    vendorName: string,
    vendorUserName: string,
    avatar: {
      url: string
    }
  }