
import { Routes, Route } from "react-router-dom";
import { Home } from "../components/pages/Home";
import { Page1 } from "../components/pages/Page1";
import { Page2 } from "../components/pages/Page2";
import { Page404 } from "../components/pages/Page404";

export const Router = () => {
  return(
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/page1" element={<Page1/>} />
      <Route path="/page2" element={<Page2/>} />
      <Route path='/*' element={<Page404/>} />
    </Routes>
  );
};
export default Router;