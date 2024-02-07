import React from "react";
import { Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

// <Link to={`${to}`}>
//         <Button bg={"primary"}>{text}</Button>
//       </Link>
// Button for in Navbar, "How does it work?" and "About Us" pages.
export const NavLink = ({ type = "primary", text, to }) => {
  return (
    <>
      <Button bg={"primary"}>
        <Link to="curator">{text}</Link>
      </Button>
    </>
  );
};
