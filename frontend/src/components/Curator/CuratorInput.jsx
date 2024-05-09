import React from "react";
import { Input, InputGroup, InputRightElement, Button } from "@chakra-ui/react";
import { ArrowUpIcon } from "@chakra-ui/icons";

const CuratorInput = ({ value, onSubmit, onChangeText, disabled }) => {
  const CURATOR_OPTIONS = [
    "make me a happy playlist for a sunny friday afternoon",
    "make me a playlist to get pumped before the gym",
    "make me a playlist that would smell like fresh cut grass",
    "make me a relaxing playlist for a rainy morning with black tea",
    "make me an upbeat Italian playlist",
    "make me a playlist that would taste like mangoes"
  ];

  return (
    <InputGroup flex={"1"} width={"auto"}>
      <Input
        width={"full"}
        borderRadius={"full"}
        size={"lg"}
        borderColor={"surface"}
        placeholder={`e.g. ${CURATOR_OPTIONS[Math.floor(Math.random() * CURATOR_OPTIONS.length)]}`}
        onChange={onChangeText}
        value={value}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !disabled) onSubmit();
        }}
      ></Input>
      <InputRightElement m={1}>
        <Button
          variant="ghost"
          size={"lg"}
          onClick={onSubmit}
          isDisabled={disabled}
        >
          <ArrowUpIcon />
        </Button>
      </InputRightElement>
    </InputGroup>
  );
};

export default CuratorInput;
