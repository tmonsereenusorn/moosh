import React, { useState } from "react";
import CuratorInput from "../../../components/CuratorInput";
import CuratorSettingsDrawer from "../../../components/CuratorSettingsDrawer";

const PromptView = ({
  onSubmit,
  prompt,
  onChangePrompt,
  settingsDrawerVisible,
  toggleSettingsDrawer
}) => {
  const [numSongs, setNumSongs] = useState(20);

  return (
    <div className="fixed inset-0 flex justify-center items-center">
      <div className="w-1/2 flex flex-col items-center space-y-2">
        <div className="w-full flex justify-center items-center">
          <CuratorInput
            onSubmit={() => onSubmit(numSongs)}
            value={prompt}
            onChangeText={(event) => onChangePrompt(event)}
            disabled={prompt.length === 0}
          />
          <CuratorSettingsDrawer
            visible={settingsDrawerVisible}
            toggleDrawer={toggleSettingsDrawer}
            numSongs={numSongs}
            setNumSongs={setNumSongs}
          />
        </div>
      </div>
    </div>
  );
};

export default PromptView;