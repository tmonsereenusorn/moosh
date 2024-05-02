import React from "react";
import CuratorInput from "../../../components/CuratorInput";
import CuratorSettingsDrawer from "../../../components/CuratorSettingsDrawer";

const PromptView = ({
  onSubmit,
  prompt,
  onChangePrompt,
  settingsDrawerVisible,
  toggleSettingsDrawer,
  settings,
  setSettings
}) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center">
      <div className="w-1/2 flex flex-col items-center space-y-2">
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
          <CuratorSettingsDrawer
            visible={settingsDrawerVisible}
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