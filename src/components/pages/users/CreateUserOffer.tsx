import React, { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"

import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardHeader from "@mui/material/CardHeader"
import Button from "@mui/material/Button"
import Link from '@mui/material/Link'

import { RequiredTextField, OptionalTextField, AmountForm } from "components/ui/TextField"
import { AuthUserContext } from "components/models/user/AuthUserProvider"
import AlertMessage from "components/ui/AlertMessage"
import { CreateUserOfferParams } from "models/user_offer/type"
import { createUserOffer } from "models/user_offer/request"
import { PrefectureCode, UserOfferRequestTypeCode } from "utils/type"

const CreateUserOffer: React.FC = () => {
  const { isSignedIn, currentUser } = useContext(AuthUserContext)
  const [prefecture, setPrefecture] = useState<PrefectureCode>(1)
  const [address, setAddress] = useState<string>("")
  const [budget, setBudget] = useState<string>("")
  const [remark, setRemark] = useState<string>("")
  const [requestType, setRequestType] = useState<UserOfferRequestTypeCode>(1)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    // const params: CreateUserOfferParams = {
    //   prefecture: prefecture,
    //   address: address,
    //   budget: budget,
    //   remark: remark,
    //   type: requestType
    // }
    const params: CreateUserOfferParams = {
      prefecture: 1,
      address: "住所",
      budget: "1234",
      remark: "remark",
      request_type: 1
    }

    try{
      const res = await createUserOffer(params)
      if (!res) { return navigate("/signup") }

      if (res && res.status === 200) {

        navigate("/")
      } else {
        // setAlertMessageOpen(true)
      }
    } catch(err) {
      console.log(err)
      // setAlertMessageOpen(true)
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
            <RequiredTextField
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
              value={remark}
              onChange={e=> setRemark(e)}
            />
            <Button
              variant="contained"
              size="large"
              color="primary"
              // disabled={!email || !password ? true : false}
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
      {/* <AlertMessage
        open={alertMessageOpen}
        setOpen={setAlertMessageOpen}
        severity="error"
        message="Invalid emai or password"
      ></AlertMessage> */}
    </>
  )
}

export default CreateUserOffer