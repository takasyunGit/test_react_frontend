import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardHeader from "@mui/material/CardHeader"
import Button from "@mui/material/Button"

import { signedInCookiesSetter } from "utils/client"
import { OptionalTextField, AmountForm, SelectForm } from "components/ui/TextField"
import AlertMessage from "components/ui/AlertMessage"
import { CreateUserOfferParams } from "models/user_offer/type"
import { createUserOffer } from "models/user_offer/request"
import { PrefectureCode, UserOfferRequestTypeCode } from "utils/type"
import { PREFECTURES_NAME_LIST, USER_OFFER_REQUEST_TYPE_LIST } from "utils/constants"
import { detectAxiosErrors } from "utils/detectErrors"

const CreateUserOffer: React.FC = () => {
  const [prefecture, setPrefecture] = useState<PrefectureCode | ''>('')
  const [address, setAddress] = useState<string>('')
  const [budget, setBudget] = useState<string>('')
  const [remark, setRemark] = useState<string>('')
  const [requestType, setRequestType] = useState<UserOfferRequestTypeCode | ''>('')
  const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false)
  const [alertMessage, setAlertMessage] = useState<string | string[]>([""])
  const navigate = useNavigate()

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const params: CreateUserOfferParams = {
      prefecture: prefecture as PrefectureCode,
      address: address,
      budget: +budget.replace(/,/g, ''),
      remark: remark,
      requestType: requestType as UserOfferRequestTypeCode
    }

    try{
      const res = await createUserOffer(params)
      if (!res) { return navigate("/signup") }
      signedInCookiesSetter(res)

      if (res && res.status === 200) {
        navigate("/")
      } else {
        setAlertMessage("An unexpected error has occurred")
        setAlertMessageOpen(true)
      }
    } catch(e) {
      detectAxiosErrors(e, setAlertMessage, setAlertMessageOpen)
    }
  }

  return (
    <>
      <form noValidate autoComplete="off">
        <Card sx={{
          padding: (theme) => theme.spacing(2),
          maxWidth: 400
        }}>
          <CardHeader sx={{textAlign: "center"}} title="Create user offer" />
          <CardContent>
            <SelectForm
              label="Prefecture"
              width="35%"
              value={prefecture as PrefectureCode}
              list={PREFECTURES_NAME_LIST}
              onChange={e=> setPrefecture(e as PrefectureCode)}
            />
            <OptionalTextField
              label="Address"
              value={address}
              onChange={e=> setAddress(e)}
            />
            <AmountForm
              label="Budget"
              value={budget}
              required={true}
              onChange={e=> setBudget(e)}
            />
            <OptionalTextField
              label="Remark"
              minRows="3"
              value={remark}
              onChange={e=> setRemark(e)}
            />
            <div>
              <SelectForm
                label="Request type"
                width="40%"
                value={requestType as UserOfferRequestTypeCode}
                list={USER_OFFER_REQUEST_TYPE_LIST}
                onChange={e=> setRequestType(e as UserOfferRequestTypeCode)}
              />
            </div>
            <Button
              variant="contained"
              size="large"
              color="primary"
              disabled={!prefecture || !budget  || !requestType ? true : false}
              sx={{
                marginTop: (theme) => theme.spacing(2),
                flexGrow: 1,
                textTransform: "none"
              }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </CardContent>
        </Card>
      </form>
      <AlertMessage
        open={alertMessageOpen}
        setOpen={setAlertMessageOpen}
        severity="error"
        message={alertMessage}
      ></AlertMessage>
    </>
  )
}

export default CreateUserOffer