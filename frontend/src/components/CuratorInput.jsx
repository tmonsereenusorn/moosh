import React from "react";
import { Input, InputGroup, InputRightElement, Button } from "@chakra-ui/react";
import { ArrowUpIcon } from "@chakra-ui/icons";

const CuratorInput = ({ value, onSubmit, onChangeText, disabled }) => {
  return (
    <InputGroup flex={"1"} width={"auto"}>
      <Input
        width={"full"}
        borderRadius={"full"}
        size={"lg"}
        borderColor={"surface"}
        placeholder={"Make me a playlist..."}
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
