import { Button } from "@chakra-ui/react";
import React from "react";

export const ButtonPrimary = ({
  text,
  onClick,
  size = "md",
  width,
  height,
}) => {
  return (
    <Button
      bg={"primary"}
      color={"white"}
      size={`${size}`}
      radii={`${size}`}
      onClick={onClick}
      width={width ? width : size.width}
      height={height ? height : size.height}
    >
      {text}
    </Button>
  );
};
