import React, { createContext, useContext, useState, useRef } from "react";

const AudioContext = createContext(null);

export const AudioProvider = ({ children }) => {
  const audio = useRef();
  const [previewId, setPreviewId] = useState();

  const setSong = (url, uri) => {
    if (!!audio.current) {
      audio.current.pause();
      setPreviewId(uri);
    }
    if (!!url) {
      audio.current = new Audio(url);
      audio.current.play();
      audio.current.addEventListener('ended', () => {
        audio.current = undefined;
        setPreviewId();
      });
      setPreviewId(uri);
    } else {
      audio.current = undefined;
      setPreviewId();
    }
  };

  const stopSong = () => {
    if (!!audio.current) {
      audio.current.pause();
      audio.current = undefined;
      setPreviewId();
    }
  };

  return (
    <AudioContext.Provider value={{ setSong, stopSong, previewId }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  return useContext(AudioContext);
};