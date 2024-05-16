import React from "react";
import { FaCog } from "react-icons/fa";
import CuratorInput from "../CuratorInput";
import CuratorSettingsDrawer from "../CuratorSettingsDrawer";

const PromptView = ({
  onSubmit,
  prompt,
  onChangePrompt,
  toggleSettingsDrawer,
  settings,
  setSettings
}) => {
  return (
    <div className="fixed inset-0 flex justify-center items-end md:items-center mb-16 md:mb-0">
      <div className="w-11/12 md:w-1/2 flex flex-col items-center space-y-2">
        <div className="w-full flex justify-center items-center">
          <CuratorInput
            onSubmit={() => {
              toggleSettingsDrawer();
              onSubmit();
            }}
            value={prompt}
            onChangeText={(event) => onChangePrompt(event)}
            disabled={prompt.length === 0}
          />
          <FaCog
            className="text-surface/[0.6] z-30 hover:cursor-pointer hover:text-surface ml-2 md:ml-1em w-4 md:w-5 h-4 md:h-5"
            onClick={toggleSettingsDrawer}
          />
          <CuratorSettingsDrawer
            toggleDrawer={toggleSettingsDrawer}
            settings={settings}
            setSettings={setSettings}
          />
        </div>
      </div>
    </div>
  );
};

export default PromptView;