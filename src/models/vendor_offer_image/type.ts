
export type VendorOfferImageType = {
  id: number,
  vendorOfferId: number,
  createdAt: string,
  updatedAt: string
  content: {
    url: string,
    thumb: { url: string }
  }
}
