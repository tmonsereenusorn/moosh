import React from "react";
import { CloseIcon } from "@chakra-ui/icons";

export const ExportedAlert = ({
  visible,
  url,
  title,
  closeCallback,
  setVisible,
}) => {
  const onClickTitle = () => {
    window.open(url, "_blank");
  };

  return (
    <>
      <div
        id="exportedAlert"
        className={`transition-opacity duration-500 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="fixed flex-col right-0 top-14 mt-4 mr-4 bg-surface bg-opacity-10 p-2 border-radius rounded-md z-10">
          <div className="flex justify-between">
            <div className="text-surface">Playlist</div>
            <CloseIcon
              className="hover:cursor-pointer"
              onClick={closeCallback}
              boxSize={2}
            />
          </div>
          <div className="text-surface">
            <div
              className="flex font-bold underline hover:cursor-pointer"
              onClick={onClickTitle}
            >
              {title}
            </div>
            successfully exported
          </div>
        </div>
      </div>
    </>
  );
};
