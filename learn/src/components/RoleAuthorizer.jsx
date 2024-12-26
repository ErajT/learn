import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie"; // Import js-cookie to handle cookies

export default function RoleAuthorizer({ allowedRole }) {
  // Retrieve the token and position from cookies
//   const token = Cookies.get("token");
  var position = Cookies.get("position");
  if (typeof position === "string" && position.startsWith('"') && position.endsWith('"')) {
    position = position.replace(/^"|"$/g, ""); // Removes the enclosing quotes
  }

  console.log( position , "RoleAuthorizer");
  console.log(allowedRole);
  console.log(allowedRole == position);


  return (
    <>
      {position ? (
        allowedRole == position ? (
          <Outlet />
        ) : (
          <Navigate to="/unauthorized" />
        )
      ) : (
        <Navigate to="/" />
      )}
    </>
  );
}
