import React, { createContext, useContext, useState } from "react";

const AudioContext = createContext(null);

export const AudioProvider = ({ children }) => {
  const [audio, setAudio] = useState();
  const [previewId, setPreviewId] = useState();

  const setSong = (url, uri) => {
    if (!!audio) {
      audio.pause();
      setPreviewId(uri);
    }
    if (!!url) {
      const song = new Audio(url);
      song.play();
      song.addEventListener('ended', () => {
        setAudio();
        setPreviewId();
      });
      setAudio(song);
      setPreviewId(uri);
    } else {
      setAudio();
      setPreviewId();
    }
  };

  const stopSong = () => {
    if (!!audio) {
      audio.pause();
      setAudio();
      setPreviewId();
    }
  };

  return (
    <AudioContext.Provider value={{ audio, setSong, stopSong, previewId }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  return useContext(AudioContext);
};