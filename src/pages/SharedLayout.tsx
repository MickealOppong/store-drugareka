
import { useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import './../css/SharedLayout.css';

import { MobileNav, NavHeader } from "../components";


const SharedLayout = ()=>{




  
    //state
    const pageRef = useRef<HTMLElement | null>(null);
     //const [pageWidth,setPageWidth ]= useState<number>(0);


     //dispatcher
    // const dispatch = useDispatch()

  let width =0;
 useEffect(()=>{

   window.addEventListener('resize',()=>{
  const page = pageRef.current
      if(page instanceof HTMLElement){
         width = page.getBoundingClientRect().width;
        
        if(width>768){
          //  dispatch(hideSidebarMenu())
        }
    }

  })
  window.removeEventListener('resize',()=>{})
 },[width])

 
    return <section className="sharedLayout" ref={pageRef}>
   <MobileNav/>
   <NavHeader/>
         <main className="entry">
              <Outlet/>
        </main>
      </section>
}
export default SharedLayout