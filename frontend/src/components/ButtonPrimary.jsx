import { Button } from "@chakra-ui/react";
import React from "react";

export const ButtonPrimary = ({
  text,
  onClick,
  size = "md",
  width,
  height,
  disabled = false
}) => {
  return (
    <Button
      colorScheme="primary"
      size={`${size}`}
      radii={`${size}`}
      onClick={onClick}
      width={width ? width : size.width}
      height={height ? height : size.height}
      disabled={disabled}
    >
      {text}
    </Button>
  );
};
