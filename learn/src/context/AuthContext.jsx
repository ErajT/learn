import React, { useCallback, useEffect, useState } from 'react'
import { createContext } from 'react'

let Authorizer  = createContext();
export default function AuthContext({children}) {
  // sessionStorage.setItem()
  let [authObj,setAuth] = useState(()=>{
    if(sessionStorage.getItem("authObj")!=null){
      let obj = sessionStorage.getItem("authObj");
      try{
        let infoObj = JSON.parse(obj);
        console.log(infoObj,"parsed");
        return infoObj;
      }
      catch{
        console.log(obj,"not parsed")
        return obj;

      }
    }
    else{
      console.log("Else block called")
      return {};
    }
  });
  console.log("outside ",authObj);
  useEffect(()=>{
    console.log("hello kaise ho yaar ",sessionStorage.getItem("ma'am"));
    let jsonObj = JSON.stringify(authObj)
    sessionStorage.setItem("authObj",jsonObj);

  },[authObj])
    console.log("context provider, ",authObj)
  return (
    <Authorizer.Provider value={{authObj,setAuth}}>
        {children}
    </Authorizer.Provider>
  )
}

export { Authorizer };
