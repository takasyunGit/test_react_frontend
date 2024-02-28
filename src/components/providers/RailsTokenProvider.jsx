import axios from 'axios';
import { API_BASEURL } from 'components/utils/constants'
import { createContext, useState, useEffect } from "react";

export const RailsTokenContext = createContext();

export const RailsTokenProvider = (props) => {
  const { children } = props;
  const [CSRF_TOKEN, setCSRF] = useState('');

  const getToken = async() => {
    const resTOKEN = await axios.get(API_BASEURL + 'sessions')
    setCSRF(resTOKEN.data);
  }
  // CSRF対策
  useEffect(() => {
    getToken();
  }, [])
  return(
    <RailsTokenContext.Provider value={CSRF_TOKEN}>
      {children}
    </RailsTokenContext.Provider>
  )
}
