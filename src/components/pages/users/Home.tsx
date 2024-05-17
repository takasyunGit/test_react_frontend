import React, { useState, useEffect } from "react"
import { Link as RouterLink, useNavigate } from 'react-router-dom'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Card, CardContent, Typography, Link, Paper, Accordion, AccordionDetails, AccordionSummary } from "@mui/material"

import { ProgressCircle } from "@src/components/ui"
import { getUserOfferList } from "@src/models/user_offer/request"
import { signedInCookiesSetter, detectAxiosErrors, dateToYYYYMMDD, USER_OFFER_REQUEST_TYPE_LIST, addComma } from "@src/utils"

import type { UserOfferType } from "@src/models/user_offer/type"

type ShowUserOfferListType = {
  [key in "draft" | "proposal" | "finished"]: UserOfferType[]
}

const Home: React.FC = () => {
  const navigate = useNavigate()
  const [userOfferList, setUserOfferList] = useState<ShowUserOfferListType>()
  const [homeLoading, setHomeLoading] = useState<boolean>(true)

  const handleGetUserOfferList = async () => {
    try{
      const res = await getUserOfferList()

      if (!res) { return navigate("/signin") }
      signedInCookiesSetter(res)

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
    userOfferList: UserOfferType[],
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
                mb: 1
            }}>
              <CardContent>
                <Typography variant="body2" gutterBottom>{dateToYYYYMMDD(new Date(offer.createdAt))}</Typography>
                <Link component={RouterLink} to={"/user_offer/" + offer.id} sx={{textDecoration: "none"}}>
                  <Typography variant="subtitle1" gutterBottom>{'【' + USER_OFFER_REQUEST_TYPE_LIST[offer.requestType] + '】' + '【予算¥' + addComma(offer.budget) + '】' + offer.address}</Typography>
                </Link>
              </CardContent>
            </Card>
          ))}
        </AccordionDetails>
      </Accordion>
    )
  }

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          mb: 1,
          padding: 2
      }}>
        <Typography variant="h4" gutterBottom>Home</Typography>
        <div>
          <Link component={RouterLink} to="/user_offer/new" sx={{textDecoration: "none"}}>
            <Typography variant="h6" gutterBottom>新しい要望書を作成する</Typography>
          </Link>
        </div>
      </Paper>
      <ProgressCircle loading={homeLoading}>
        <>
          {/* {!!userOfferList?.draft.length &&
            <OfferAccordion userOfferList={userOfferList.draft} title={"下書き中の提案"}/>
          } */}
          {!!userOfferList?.proposal.length &&
            <OfferAccordion userOfferList={userOfferList.proposal} title={"検討中の要望書"}/>
          }
          {!!userOfferList?.proposal.length &&
            <OfferAccordion userOfferList={userOfferList.finished} title={"完了した要望書"}/>
          }
        </>
      </ProgressCircle>
    </>
  )
}

export default Home