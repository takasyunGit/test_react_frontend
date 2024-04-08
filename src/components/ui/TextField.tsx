import React from "react"

import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import { TextField, MenuItem, IconButton, FormControl, OutlinedInput, InputLabel, InputAdornment } from "@mui/material"

import { stringToHalfWidth } from "@src/utils/formatConverter"
import { addComma } from "@src/utils/formatConverter"

import type { NumberCodeListType } from "@src/utils/type"

type ChildProps<T = string> = {
  label: string
  value: T,
  required?: boolean
  type?: string
  minRows?: string
  onChange: (targetValue: T) => void
  onBlur?: (targetValue: T) => void
}

export const RequiredTextField = (props: ChildProps) => {
  const { label, value, required = true, type = "text", minRows = "", onChange, onBlur = () => {} } = props

  return (
    <TextField
      variant="outlined"
      type={type}
      required={required}
      fullWidth
      multiline
      minRows={minRows}
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
      minRows={props.minRows}
      onChange={e => props.onChange(e)}
    />
  )
}

export const AmountForm = (props: ChildProps) => {
  // 全角は半角に変換し、3桁ごとにカンマを差し込む
  const formatter = (str: string): string => {
    const removed = str.replace(/,/g, '')
    const result = isNaN(+stringToHalfWidth(removed)) ? "" : addComma(+stringToHalfWidth(removed))

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
}

export const PasswordForm: React.FC<PasswordProps> = (props) => {
  const {id, label, showPassword, value, setPassword, setShowPassword} = props
  const handleSetShowPassword = () => {
    setShowPassword((show) => !show)
  }

  return (
    <FormControl variant="outlined" sx={{mb: 1, width: '100%' }}>
      <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
      <OutlinedInput
        id={id}
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={e => setPassword(e.target.value)}
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