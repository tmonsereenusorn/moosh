import React from "react";
import { Input, InputGroup, InputRightElement, Button } from "@chakra-ui/react";
import { ArrowUpIcon } from "@chakra-ui/icons";

const CuratorInput = ({ value, onSubmit, onChangeText, disabled }) => {
  return (
    <InputGroup>
      <Input
        w={"full"}
        borderColor={"surface"}
        placeholder={"Ask me to give you music for anything"}
        onChange={onChangeText}
        value={value}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !disabled) onSubmit();
        }}
      ></Input>
      <InputRightElement>
        <Button
          variant="ghost"
          size={"sm"}
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
