import React, { useState, useEffect, useContext } from "react"
import Axios from 'axios'
import { useNavigate, useLocation, useParams } from "react-router-dom"
import { Card, CardContent, CardHeader, Typography } from "@mui/material"

import { signedInCookiesSetter } from "utils/client"
import { AuthUserContext } from "components/models/user/AuthUserProvider"
import { getUserOffer } from "models/user_offer/request"
import { UserOffer } from "models/user_offer/type"
import { PREFECTURES_NAME_LIST, USER_OFFER_REQUEST_TYPE_LIST } from "utils/constants"
import { detectAxiosErrors } from "utils/detectErrors"

const ShowUserOffer: React.FC = () => {
  const navigate = useNavigate()
  const params = useParams()
  const { loading, setLoading, currentUser } = useContext(AuthUserContext)
  const [ offerLoading, setOfferLoading] = useState<boolean>(true)
  const [userOffer, setUserOffer] = useState<UserOffer | undefined>()
  const [prefecture, setPrefecture] = useState<string>('-')
  const [requestType, setRequestType] = useState<string>('-')
  const handleGetUserOffer = async () => {

    try{
      const res = await getUserOffer(params.id as string)
      if (!res) { return navigate("/signup") }
      signedInCookiesSetter(res)

      if (res && res.status === 200) {
        const object = res!.data.data
        setUserOffer(object)
        setPrefecture(PREFECTURES_NAME_LIST[object.prefecture])
        setRequestType(USER_OFFER_REQUEST_TYPE_LIST[object.requestType])
      } else {
        console.log("An unexpected error has occurred")
        navigate("/Page404")
      }
    } catch(e) {
      detectAxiosErrors(e)
    }
    setOfferLoading(false)
  }

  useEffect(() => {handleGetUserOffer()}, [])

  if (!loading && !offerLoading) {
    return(
      <>
        <Card sx={{
          padding: (theme) => theme.spacing(2),
          maxWidth: 400
        }}>
          <CardHeader sx={{textAlign: "center"}} title="Show user offer" />
          <CardContent>
            <Typography variant="body1" gutterBottom>{currentUser?.name}様</Typography>
            <Typography variant="body1" gutterBottom>id: {userOffer?.id}</Typography>
            <Typography variant="body1" gutterBottom>ユーザーID: {userOffer?.userId}</Typography>
            <Typography variant="body1" gutterBottom>都道府県: {prefecture}</Typography>
            <Typography variant="body1" gutterBottom>住所: {userOffer?.address}</Typography>
            <Typography variant="body1" gutterBottom>予算: {userOffer?.budget}</Typography>
            <Typography variant="body1" gutterBottom>要望タイプ: {requestType}</Typography>
            <Typography variant="body1" gutterBottom>id: {userOffer?.id}</Typography>
            <Typography variant="body1" gutterBottom>作成日: {userOffer?.id}</Typography>
            <Typography variant="body1" gutterBottom>更新日: {userOffer?.id}</Typography>
          </CardContent>
        </Card>
      </>
    )
  } else {
    return(<></>)
  }
}

export default ShowUserOffer