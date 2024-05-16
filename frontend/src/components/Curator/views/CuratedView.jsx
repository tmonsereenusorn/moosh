import React from "react";
import { Checkbox } from "@chakra-ui/react";
import { AudioProvider } from "../../../contexts/AudioProvider";
import TrackCard from "../../../components/TrackCard";
import ChoiceLayer from "../../../components/ChoiceLayer";

const CuratedView = ({
  recs,
  prompt,
  synopsis,
  onExport,
  onSubmit,
  onReset,
  onChangeTitle,
  title,
  selectedTracks,
  toggleTrackSelection,
  toggleSelectAllButton,
  selectAllButton,
  getSelectedCount,
  getUnselectedCount,
  tryItMode,
  previewCallback,
  linkCallback,
}) => {
  return (
    <>
      <div className="flex flex-col w-3/4 h-[100vh] pt-14 pb-24">
        {recs.length > 0 && (
          <div className="w-full items-center justify-center p-2">
            <div className="text-2xl font-bold text-surface text-center">
              {prompt}
            </div>
            <div className="text-m text-surface text-center border border-gray-300 p-3 rounded mb-3 mt-2 bg-gray-100">
              <div>
                {synopsis}
              </div>
            </div>
            <div className="flex justify-left items-center pl-4">
              <Checkbox
                colorScheme="dark_accent"
                onChange={toggleSelectAllButton}
                isChecked={selectAllButton}
              />
              <p className="font-bold text-sm text-surface ml-3">
                {getSelectedCount()} selected
              </p>
            </div>
          </div>
        )}
        <div className="flex-grow overflow-y-auto">
          <AudioProvider>
            {recs.map((recommendation) => {
              return (
                <TrackCard
                  key={recommendation.id}
                  artist={recommendation.artist}
                  title={recommendation.title}
                  duration={recommendation.duration}
                  preview={recommendation.preview}
                  uri={recommendation.uri}
                  url={recommendation.url}
                  isSelected={selectedTracks[recommendation.id]}
                  isNew={recommendation.isNew}
                  onToggleSelection={() =>
                    toggleTrackSelection(recommendation.id)
                  }
                  previewCallback={previewCallback}
                  linkCallback={linkCallback}
                />
              );
            })}
          </AudioProvider>
        </div>
      </div>
      <div
        className={`fixed bottom-0 flex h-24 w-2/3 bg-white items-center justify-center p-[32px] space-x-4`}
      >
        <ChoiceLayer
          onGenerate={onExport}
          onRegenerate={onSubmit}
          onCancel={onReset}
          onChangeTitle={onChangeTitle}
          disabled={title.length === 0}
          unselectedCount={getUnselectedCount()}
          selectedCount={getSelectedCount()}
          tryItMode={tryItMode}
        />
      </div>
    </>
  );
};

export default CuratedView;
