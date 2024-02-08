import React, { createContext, useContext, useState } from "react";

const AudioContext = createContext(null);

export const AudioProvider = ({ children }) => {
  const [audio, setAudio] = useState();

  const setSong = (url) => {
    if (!!audio) audio.pause();
    if (!!url) {
      const song = new Audio(url);
      song.play();
      setAudio(song);
    } else {
      setAudio();
    }
  };

  const stopSong = () => {
    if (!!audio) audio.pause();
  };

  return (
    <AudioContext.Provider value={{ setSong, stopSong }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  return useContext(AudioContext);
};