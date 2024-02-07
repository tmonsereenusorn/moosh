import React from "react";
import { Input, InputGroup, InputRightElement, Button } from "@chakra-ui/react";
import { ArrowUpIcon } from "@chakra-ui/icons";

const CuratorInput = ({ input, onSubmit, onChangeText, disabled }) => {
  return (
    <InputGroup>
      <Input
        w={"full"}
        margin={"32px"}
        borderColor={"surface"}
        placeholder={"Ask me to give you music for anything"}
        onChange={onChangeText}
      ></Input>
      <InputRightElement margin={"32px"}>
        <Button variant="ghost" size={"sm"} onClick={onSubmit}>
          <ArrowUpIcon />
        </Button>
      </InputRightElement>
    </InputGroup>
  );
};

export default CuratorInput;
