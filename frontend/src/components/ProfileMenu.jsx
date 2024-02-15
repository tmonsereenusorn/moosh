import React, { useRef } from "react";
import { 
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  AlertDialog,
  useDisclosure,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogBody,
  AlertDialogHeader,
  AlertDialogFooter
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { clearAllCookies } from "../api/auth";
import { redirect, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";

const ProfileMenu = ({ name }) => {
  const location = useLocation();
  const { setAuthorized } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const signOut = () => {
    clearAllCookies();
    setAuthorized(false);
    onClose();
    redirect("/");
  };

  return (
    <>
      <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="ghost" opacity={0.7} colorScheme="">
          hi, {name}.
        </MenuButton>
        <MenuList>
          {location.pathname !== "/curator" && <MenuItem onClick={() => redirect("/curator")}>go to curator.</MenuItem>}
          <MenuItem onClick={onOpen} color="red">sign out.</MenuItem>
        </MenuList>
      </Menu>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              sign out.
            </AlertDialogHeader>

            <AlertDialogBody>
              are you sure?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                no
              </Button>
              <Button colorScheme='red' onClick={() => signOut()} ml={3}>
                absolutely
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default ProfileMenu;