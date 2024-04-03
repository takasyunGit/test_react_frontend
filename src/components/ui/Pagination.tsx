import React from "react"
import { Pagination } from "@mui/material"

import { NumberListType } from "utils/type"

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

export const initialPaginate = (pageNum?: number, paginateNumberList: NumberListType = []): [number | null, number] => {
  const url_string = window.location.href
  const url = new URL(url_string)
  const urlQuery = new URLSearchParams(url.search)
  const pageNumber = pageNum || urlQuery.get("page") || 1
  const keyId = paginateNumberList[+pageNumber] || null
  url.search = "page=" + String(pageNumber)
  // url pathにpageのクエリ追加
  window.history.pushState({}, "", url.toString())
  return [keyId, +pageNumber]
}


export default DefaultPagination
