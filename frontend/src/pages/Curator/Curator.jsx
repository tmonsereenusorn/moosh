import React, { useState } from "react";
import { getRecommendations } from "../../api/recommendation";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  List,
  ListItem,
} from "@chakra-ui/react";
import CuratorInput from "../../components/CuratorInput";

const Curator = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false); // For rendering a loading view while waiting for recommendations.
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [recs, setRecs] = useState([]);
  const [active, setActive] = useState(false); // For deactivating the button when there's no prompt.

  const onChangeText = (event) => {
    setPrompt(event.target.value);
  };

  const onSubmit = async () => {
    console.log("Prompted with: " + prompt);
    setLoading(true);
    const recs = await getRecommendations(prompt);
    setRecs(recs);
    setLoading(false);
    onOpen();
    console.log(recs);
  };

  // Refactor the modal component and create a song card component with track metadata on it
  // Attach a spotify API call for the playlist creation in account
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-2/3 h-screen flex items-end justify-center">
        <CuratorInput
          onSubmit={onSubmit}
          value={prompt}
          onChangeText={(event) => onChangeText(event)}
        />
        <Modal isOpen={isOpen} onClose={onClose} width={"80vw"} height={"75vh"}>
          <ModalOverlay />
          <ModalContent height={"75vh"}>
            <ModalHeader>{prompt}</ModalHeader>
            <ModalCloseButton />
            <ModalBody overflowY={"auto"}>
              <List spacing={3}>
                {recs.map((item, index) => (
                  <ListItem key={index}>
                    {item.artist + ": " + item.title}
                  </ListItem>
                ))}
              </List>
            </ModalBody>

            <ModalFooter>
              <Button
                backgroundColor="primary"
                textColor="white"
                mr={3}
                onClick={onClose}
              >
                Confirm
              </Button>
              <Button textColor="dark_accent" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};

export default Curator;
