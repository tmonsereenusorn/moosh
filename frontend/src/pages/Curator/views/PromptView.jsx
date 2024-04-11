import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import CuratorInput from "../../../components/CuratorInput";
import CuratorSettingsDrawer from "../../../components/CuratorSettingsDrawer";

const PromptView = ({
  onSubmit,
  prompt,
  onChangePrompt,
  toggleSettingsDrawer,
  isSettingsOpen,
  numSongs,
  setNumSongs
}) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center">
      <div className="w-1/2 flex flex-col items-center space-y-2">
        <div className="w-full flex justify-center items-center">
          <CuratorInput
            onSubmit={onSubmit}
            value={prompt}
            onChangeText={(event) => onChangePrompt(event)}
            disabled={prompt.length === 0}
          />
          <button
            aria-label="Curator Settings"
            className="ml-3"
            onClick={toggleSettingsDrawer}
          >
            <FontAwesomeIcon icon={faCog} />
          </button>
        </div>
        {isSettingsOpen && (
          <CuratorSettingsDrawer
            numSongs={numSongs}
            setNumSongs={setNumSongs}
          />
        )}
      </div>
    </div>
  );
};

export default PromptView;