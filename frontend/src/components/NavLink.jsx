import React from "react";
import { Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export const NavLink = ({ type = "primary", text, to }) => {
  return (
    <div className="pr-4">
      <Button variant="link" color={"surface"} size={"lg"}>
        <Link to={`${to}`}>{text}</Link>
      </Button>
    </div>
  );
};
