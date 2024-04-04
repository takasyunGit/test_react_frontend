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

export type SignInType = "User" | "Vendor"

export type AlertMessageContextType = {
  alertMessageOpen: boolean
  setAlertMessageOpen: React.Dispatch<React.SetStateAction<boolean>>
  severity: AlertClassType
  setSeverity: React.Dispatch<React.SetStateAction<AlertClassType>>
  alertMessage: string | string[]
  setAlertMessage: React.Dispatch<React.SetStateAction<string | string[]>>
}

export type AlertClassType = "error" | "success" | "info" | "warning"