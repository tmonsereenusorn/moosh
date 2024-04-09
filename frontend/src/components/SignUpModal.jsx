import React, { useDisclosure } from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react'
import { ButtonPrimary } from "./ButtonPrimary";

  const SignUpModal = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <>
          <ButtonPrimary onClick={onOpen}>Open Modal</ButtonPrimary>
    
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Sign Up for Moosh</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                text
              </ModalBody>
    
              <ModalFooter>
                <ButtonPrimary colorScheme='primary' mr={3} onClick={onClose}>
                  Close
                </ButtonPrimary>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )
    }

    export default SignUpModal;