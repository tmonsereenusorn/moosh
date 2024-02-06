import { Button } from "@chakra-ui/react";
import React from "react";

export const ButtonPrimary = ({ text, onClick }) => {
  return (
    <Button
      bg={"primary"}
      color={"white"}
      size={"xl"}
      radii={"xl"}
      onClick={onClick}
    >
      {text}
    </Button>
  );
};
