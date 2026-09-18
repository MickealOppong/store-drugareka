import type { Store } from "redux";
import { DesktopLanding, MobileLanding } from "../components/index";
import '../css/Landing.css';
import { storeApi } from "../features/api/storeApi";
import { type AppDispatch, type RootState } from "../store";

export const loader =(store:Store<RootState>)=>async ()=>{
    const dispatch = store.dispatch as AppDispatch;


  const topCategories= await dispatch(storeApi.endpoints.getTop6ProductCategories.initiate());      
                 
  return topCategories.data||[];
}
   

const Landing = () => {
  return (
    <>
      <div className="landing-desktop">
        <DesktopLanding/>
      </div>

      <div className="landing-mobile">
        <MobileLanding/>
      </div>
    </>
  );
};
export default Landing