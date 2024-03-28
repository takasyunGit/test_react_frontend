type Enumerate<Max extends number, IncrementalNumbers extends number[] = []> =
  IncrementalNumbers['length'] extends Max ? IncrementalNumbers[number] : Enumerate<Max, [...IncrementalNumbers, IncrementalNumbers['length']]>

type IntRange<Min extends number, Max extends number> =
  Exclude<Enumerate<Max>, Enumerate<Min>> | Max

export type PrefectureCode = IntRange<1, 47>

export type UserOfferRequestTypeCode = 1 | 2 | 3

export type NumberCodeListType = {
  [key: number]: string;
}

export type NumberListType = {
  [key: number]: number
}