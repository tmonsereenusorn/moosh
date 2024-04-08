import React, { createContext, useContext, useState } from "react";

const PopoverContext = createContext(null);

export const PopoverProvider = ({ children, _position }) => {
  const [showing, setShowing] = useState(false);
  const [rect, setRect] = useState({});
  const [position, setPosition] = useState(_position);

  return (
    <PopoverContext.Provider value={{ showing, setShowing, rect, setRect, position, setPosition }}>
      {children}
    </PopoverContext.Provider>
  );
};

export const usePopover = () => {
  return useContext(PopoverContext);
};