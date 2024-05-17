import React from "react"

import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import { TextField, MenuItem, IconButton, FormControl, OutlinedInput, InputLabel, InputAdornment } from "@mui/material"

import { stringToHalfWidth } from "@src/utils/formatConverter"
import { addComma } from "@src/utils/formatConverter"

import type { NumberCodeListType } from "@src/utils/type"

type ChildProps<T = string> = {
  id?: string
  label: string
  value: T,
  required?: boolean
  type?: string
  minRows?: number
  maxRows?: number
  sx?: {[key: string]: string | number}
  onChange: (targetValue: T) => void
  onClick?: (targetValue: T) => void
  onBlur?: (targetValue: T) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void
}

export const RequiredTextField = (props: ChildProps) => {
  const { id, label, value, required = true, type = "text", minRows = 1, maxRows = 1, sx, onChange, onBlur = () => {}, onKeyDown  = () => {}, onClick = () => {}} = props

  return (
    <TextField
      id={id}
      variant="outlined"
      type={type}
      required={required}
      fullWidth
      multiline
      minRows={minRows}
      maxRows={maxRows}
      label={label}
      value={value}
      margin="dense"
      sx={sx}
      onChange={e => onChange(e.target.value)}
      onBlur={e => onBlur(e.target.value)}
      InputProps={{inputProps:{onClick: (e) => onClick(e.currentTarget.value)}}}
      // onClick={e => onClick(e.currentTarget.value)}
      // onKeyDown={onKeyDown}
    />
  )
}

export const OptionalTextField = (props: ChildProps) => {
  const {onKeyDown = () => {}} = props

  return (
    <RequiredTextField
      id={props.id}
      required={false}
      label={props.label}
      value={props.value}
      minRows={props.minRows}
      maxRows={props.minRows}
      sx={props.sx}
      onChange={e => props.onChange(e)}
      onKeyDown={e => onKeyDown(e)}
    />
  )
}

export const AmountForm = (props: ChildProps) => {
  const {onKeyDown = () => {}} = props
  // 全角は半角に変換し、3桁ごとにカンマを差し込む
  const formatter = (str: string): string => {
    const removed = str.replace(/,/g, '')
    const result = isNaN(+stringToHalfWidth(removed)) ? "" : addComma(+stringToHalfWidth(removed))

    return result
  }
  const replaceComma = (str: string): string => {
    console.log("d")
    return str.replace(/,/g, '')
  }

  return (
    <RequiredTextField
      id={props.id}
      type ="tel"
      required={props.required}
      label={props.label}
      value={props.value}
      onChange={e => props.onChange(e)}
      onBlur={e => props.onChange(formatter(e))}
      onClick={e => props.onChange(replaceComma(e))}
      onKeyDown={e => onKeyDown(e)}
    />
  )
}

type SelectFormProps = ChildProps<number> & {
  width: string,
  list: NumberCodeListType
}

export const SelectForm = (props: SelectFormProps) => {
  const createList = (menu: NumberCodeListType) => {
    const list = []
    for ( const i of Object.keys(menu).map(Number)) {
      list.push(<MenuItem value={i} key={"prefecture-" + i}>{menu[i]}</MenuItem>)
    }
    return list
  }

  return (
    <TextField
      id={props.id}
      label={props.label}
      required
      select
      sx={{width: props.width}}
      value={props.value}
      onChange={e=> props.onChange(+e.target.value)}
    >
      {createList(props.list)}
    </TextField>
  )

}

type PasswordProps = {
  id?: string
  label?: string
  showPassword: boolean
  value: string
  setPassword: (value: string) => void
  setShowPassword: (value: (show: boolean) => boolean) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export const PasswordForm: React.FC<PasswordProps> = (props) => {
  const {id, label, showPassword, value, setPassword, setShowPassword, onKeyDown} = props
  const handleSetShowPassword = () => {
    setShowPassword((show) => !show)
  }

  return (
    <FormControl variant="outlined" sx={{mb: 1, width: '100%' }}>
      <InputLabel htmlFor="outlined-adornment-password">{label}</InputLabel>
      <OutlinedInput
        id={id}
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={e => setPassword(e.target.value)}
        onKeyDown={onKeyDown}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={e => handleSetShowPassword()}
              edge="end"
            >
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
          </InputAdornment>
        }
        label={label}
      />
    </FormControl>
  )
}