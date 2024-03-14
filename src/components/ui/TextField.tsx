import React from "react"
import TextField from "@mui/material/TextField"
import { stringToHalfWidth } from "utils/formatConverter"


type ChildProps = {
  label: string
  value: string,
  required?: boolean
  type?: string
  onChange: (targetValue: string) => void
  onBlur?: (targetValue: string) => void
}

export const RequiredTextField = (props: ChildProps) => {
  const { label, value, required = true, type = "text", onChange, onBlur = () => {} } = props

  return (
    <TextField
      variant="outlined"
      type={type}
      required={required}
      fullWidth
      label={label}
      value={value}
      margin="dense"
      onChange={e => onChange(e.target.value)}
      onBlur={e => onBlur(e.target.value)}
    />
  )
}

export const OptionalTextField = (props: ChildProps) => {
  return (
    <RequiredTextField
      required={false}
      label={props.label}
      value={props.value}
      onChange={e => props.onChange(e)}
    />
  )
}

export const AmountForm = (props: ChildProps) => {
  const addComma = new Intl.NumberFormat("ja-JP");
  const formatter = (str: string): string => {
    const removed = str.replace(/,/g, '')
    const result = isNaN(+stringToHalfWidth(removed)) ? "" : addComma.format(+stringToHalfWidth(removed))

    return result
  }

  return (
    <RequiredTextField
      type ="tel"
      required={props.required}
      label={props.label}
      value={props.value}
      onChange={e => props.onChange(e)}
      onBlur={e => props.onChange(formatter(e))}
    />
  )
}