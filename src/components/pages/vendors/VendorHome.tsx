import React, { useState, useEffect } from "react"
import { Link as RouterLink, useNavigate } from 'react-router-dom'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Card, CardContent, Typography, Link, Accordion, AccordionDetails, AccordionProps, AccordionSummary, Avatar, Box } from "@mui/material"

import { stringAvatar } from "@src/components/ui"
import ProgressCircle from "@src/components/ui/ProgressCircle"
import { vendorGetUserOfferList } from "@src/models/user_offer/request"
import { signedInCookiesSetter, detectAxiosErrors, dateToYYYYMMDD, USER_OFFER_REQUEST_TYPE_LIST, addComma } from "@src/utils"

import type { ShowUserOfferType } from "@src/models/user_offer/type"

type ShowUserOfferListType = {
  [key in "proposal" | "notTouchedOffers"]: ShowUserOfferType[]
}

const Home: React.FC = () => {
  const navigate = useNavigate()
  const [userOfferList, setUserOfferList] = useState<ShowUserOfferListType>()
  const [homeLoading, setHomeLoading] = useState<boolean>(true)

  const handleGetUserOfferList = async () => {
    try{
      const res = await vendorGetUserOfferList()

      if (!res) { return navigate("/vendor/signin") }
      signedInCookiesSetter(res, "Vendor")

      if (res && res.status === 200) {
        setUserOfferList(res!.data.data)
      } else {
        console.log("An unexpected error has occurred")
        navigate("/Page404")
      }
    } catch(e) {
      detectAxiosErrors(e)
    }
    setHomeLoading(false)
  }

  useEffect(() => {handleGetUserOfferList()},[])

  type AccordionProps = {
    userOfferList: ShowUserOfferType[],
    title: string
  }

  const OfferAccordion: React.FC<AccordionProps> = (props) => {
    return (
      <Accordion sx={{mb:2}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          sx={{backgroundColor: "whitesmoke"}}
        >
          {props.title}
        </AccordionSummary>
        <AccordionDetails sx={{backgroundColor: "whitesmoke"}}>
          {props.userOfferList.map((offer) => (
            <Card
            key={"userOffer" + offer.id}
            sx={{
              padding: (theme) => theme.spacing(2),
              mb: 1,
            }}>
              <CardContent>
                <Typography variant="body2" gutterBottom>{dateToYYYYMMDD(new Date(offer.createdAt))}</Typography>
                <Link component={RouterLink} to={"/vendor/user_offer/" + offer.id} sx={{textDecoration: "none"}}>
                  <Typography variant="h6" gutterBottom>
                    {'【' + USER_OFFER_REQUEST_TYPE_LIST[offer.requestType] + '】' +
                    '【予算: ¥' + addComma(offer.budget) + '】' + offer.address}
                    </Typography>
                </Link>
                <Box sx={{display: "flex", justifyContent: "end"}}>
                  {offer.avatar?.url ? <Avatar src={offer.avatar.url} sx={{ width: 24, height: 24, mr: 1}}/> : <Avatar {...stringAvatar(offer.userName)} sx={{ width: 24, height: 24, mr: 1 }}/>}
                  <Typography variant="body1" gutterBottom>{offer.userName}</Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </AccordionDetails>
      </Accordion>
    )
  }

  return (
    <>
      <Typography variant="h4" gutterBottom>Vendor Home</Typography>
      <ProgressCircle loading={homeLoading}>
        {!!userOfferList?.proposal?.length &&
          <OfferAccordion userOfferList={userOfferList.proposal} title={"自分が提案したコンペ"}/>
        }
        {!!userOfferList?.notTouchedOffers?.length &&
          <OfferAccordion userOfferList={userOfferList.notTouchedOffers} title={"現在募集中のコンペ"}/>
        }
      </ProgressCircle>
    </>
  )
}

export default Home