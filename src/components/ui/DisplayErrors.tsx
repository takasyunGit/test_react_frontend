import React from "react"

type Props = {
  errors?: any,
  children: React.ReactNode
 }

const DisplayErrors: React.FC<Props> = (props) => {
  const { errors, children } = props

  if (!errors){
    return(
      <>
        {children}
      </>
    )
  }
  if (errors?.response?.status === 404){
    return(
      <>
        ページが見つかりませんでした。
      </>
    )
  }
  return(
    <>
      予期せぬエラーが発生しました。
    </>
  )
}

export default DisplayErrors