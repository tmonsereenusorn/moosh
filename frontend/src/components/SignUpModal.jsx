import React from "react";
import { useNavigate } from "react-router-dom";
import {
    Button,
    AbsoluteCenter,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    // ModalCloseButton,
    SimpleGrid,
    List,
    ListItem,
    ListIcon,
    Box,
    Text,
  } from '@chakra-ui/react'
import { ButtonPrimary } from "./ButtonPrimary";
import { MdIosShare } from "react-icons/md";
import { MdAutoAwesome } from "react-icons/md";
import { MdHistory } from "react-icons/md";
import { MdHandshake } from "react-icons/md";


const SignUpModal = ({ closeModal, modalOpen }) => {
    const navigate = useNavigate();

    const routeSignUp = () => {
        navigate("/signup");
    }

    return (
        <Modal size={"2xl"} isOpen={modalOpen} onClose={() => closeModal(false)}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <div className="text-center text-primary font-bold text-4xl">Sign Up for Moosh</div>
                </ModalHeader>
                {/* <ModalCloseButton/> */}
                <ModalBody>
                    <Box p={5}>
                        <SimpleGrid columns={2} spacing={4}>
                            <List spacing={3}>
                            <ListItem>
                                <ListIcon as={MdIosShare} color="black.500" />
                                export playlists to Spotify
                            </ListItem>
                            <ListItem>
                                <ListIcon as={MdHistory} color="black.500" />
                                view your Moosh history
                            </ListItem>
                            </List>
                            <List spacing={3}>
                            <ListItem>
                                <ListIcon as={MdAutoAwesome} color="black.500" />
                                personalized recommendations
                            </ListItem>
                            <ListItem>
                                <ListIcon as={MdHandshake} color="black.500" />
                                eternal swag and vibes
                            </ListItem>
                            </List>
                        </SimpleGrid>
                    </Box>
                </ModalBody>

                <ModalFooter>
                    <AbsoluteCenter axis='horizontal'>
                        <ButtonPrimary onClick={routeSignUp} text={"let's go!"} colorScheme='primary' mr={3}/>
                    </AbsoluteCenter>
                    <Button variant='ghost' onClick={() => closeModal(false)}>another time</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default SignUpModal;