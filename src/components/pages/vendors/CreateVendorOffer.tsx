import React, { useState, useContext, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Card, CardContent, CardHeader,Box, Accordion, AccordionSummary, AccordionDetails } from "@mui/material"

import ShowUserOfferCommon from "@src/components/pages/common/ShowUserOfferCommon"
import { AlertMessageContext, DisplayErrors, RequiredTextField, OptionalTextField, AmountForm, DefaultButton } from "@src/components/ui";
import { vendorGetUserOffer } from "@src/models/user_offer/request"
import { createVendorOffer } from "@src/models/vendor_offer/request"
import { signedInCookiesSetter, detectAxiosErrors } from "@src/utils";

import type { ShowUserOfferType } from "@src/models/user_offer/type"
import type { CreateVendorOfferParams } from "@src/models/vendor_offer/type"

const CreateVendorOffer: React.FC = () => {
  const [title, setTitle] = useState<string>('')
  const [remark, setRemark] = useState<string>('')
  const [estimate, setEstimate] = useState<string>('')
  const [userOfferLoading, setUserOfferLoading] = useState<boolean>(true)
  const [userOffer, setUserOffer] = useState<ShowUserOfferType | undefined>()
  const [userOffererrors, setUserOfferErrors] = useState<any>()
  const params = useParams()

  const { setAlertMessageOpen, setAlertMessage } = useContext(AlertMessageContext)
  const userOfferId = useParams().id as string
  const navigate = useNavigate()

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault()

    const params: CreateVendorOfferParams = {
      title: title,
      userOfferId: +userOfferId,
      remark: remark,
      estimate: +estimate.replace(/,/g, ''),
    }

    try{
      const res = await createVendorOffer(params)

      if (!res) { return navigate("/vendor/signin") }
      signedInCookiesSetter(res, "Vendor")

      if (res && res.status === 200) {
        const object = res!.data.data
        navigate("/vendor/user_offer/" + userOfferId + "/vendor_offer/" + object.id)
      } else {
        setAlertMessage("An unexpected error has occurred")
        setAlertMessageOpen(true)
      }
    } catch(e) {
      detectAxiosErrors(e, setAlertMessageOpen, setAlertMessage)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.nativeEvent.isComposing || e.key !== 'Enter') return
    if (!title || !estimate) return
    handleSubmit(e)
  }

  const handleGetUserOffer = async () => {
    try{
      const res = await vendorGetUserOffer(params.id as string)
      if (!res) { return navigate("/vendor/signin") }
      signedInCookiesSetter(res, "Vendor")

      if (res && res.status === 200) {
        setUserOffer(res.data.data)
      } else {
        console.log("An unexpected error has occurred")
      }
    } catch(e) {
      setUserOfferErrors(e)
      detectAxiosErrors(e)
    }
    setUserOfferLoading(false)
  }

  useEffect(() => {handleGetUserOffer()}, [])

  return (
    <Box>
      <DisplayErrors errors={userOffererrors}>
        <Accordion sx={{mb:2}}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            sx={{backgroundColor: "whitesmoke"}}
          >
            {userOffer?.name}様の要望詳細
          </AccordionSummary>
          <AccordionDetails sx={{backgroundColor: "whitesmoke"}}>
            <ShowUserOfferCommon userOffer={userOffer} offerLoading={userOfferLoading} />
          </AccordionDetails>
        </Accordion>
      </DisplayErrors>

      <form noValidate>
        <Card sx={{
          padding: (theme) => theme.spacing(2),
        }}>
          <CardHeader sx={{textAlign: "center"}} title="提案の作成" />
          <CardContent>
            <RequiredTextField
              label="Title"
              value={title}
              onChange={e=> setTitle(e)}
              onKeyDown={handleKeyDown}
            />
            <OptionalTextField
              label="Remark"
              value={remark}
              minRows={8}
              maxRows={10}
              onChange={e=> setRemark(e)}
              onKeyDown={handleKeyDown}
            />
            <AmountForm
              label="Estimate"
              value={estimate}
              required={true}
              onChange={e=> setEstimate(e)}
              onKeyDown={handleKeyDown}
            />
            <DefaultButton
              disabled={!title || !estimate ? true : false}
              onClick={handleSubmit}
            >
              Submit
            </DefaultButton>
          </CardContent>
        </Card>
      </form>
    </Box>
  )
}

export default CreateVendorOffer