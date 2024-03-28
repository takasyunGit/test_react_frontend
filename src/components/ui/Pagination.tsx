import React from "react"
import { Pagination } from "@mui/material"

import { stringToHalfWidth } from "utils/formatConverter"
import { NumberCodeListType } from "utils/type"
import { addComma } from "utils/formatConverter"

type ChildProps = {
  count: number
  page?: number
  onChange: () => void
}

export const DefaultPagination: React.FC<ChildProps> = (props) => {
  const { count, page, onChange } = props

  return (
    <Pagination
      count={count}
      variant="outlined"
      color="primary"
      siblingCount={0}
      boundaryCount={2}
      page={page}
      onChange={onChange}
    />
  )
}

export default DefaultPagination
