import React, { useLayoutEffect, useRef, useState } from "react";
import { PopoverProvider, usePopover } from "../contexts/PopoverContext";

const Trigger = ({ children }) => {
  const { setShowing, setRect } = usePopover();
  const ref = useRef(null);

  const onClick = e => {
    e.stopPropagation();
    if (ref.current === null) return;

    const bounds = ref.current.getBoundingClientRect();
    setRect(bounds);

    setShowing(showing => !showing);
  };

  return (
    <div onClick={onClick} ref={ref}>
      {children}
    </div>
  );
};

const Content = ({ children }) => {
  const { showing, rect, position, setShowing } = usePopover();
  const ref = useRef(null);
  const [coords, setCoords] = useState({ left: 0, top: 0 });

  useLayoutEffect(() => {
    if (ref.current === null) return;

    const bounds = ref.current.getBoundingClientRect();
    const coords = getPopoverCoords(rect, bounds, position);
    setCoords(coords)
  }, [rect, position]);

  return <dialog
    ref={ref}
    className="rounded-md p-2 fixed bg-gray-100 border border-black/[0.4] z-40"
    open={showing}
    style={{ left: `${coords.left}px`, top: `${coords.top}px` }}
    onMouseLeave={() => setShowing(false)}
  >
    {children}
  </dialog>
};

const Popover = ({ children, position = "right" }) => {
  return (
    <PopoverProvider _position={position}>
      {children}
    </PopoverProvider>
  );
};

Popover.Trigger = Trigger;
Popover.Content = Content;

export default Popover;

const getPopoverCoords = (triggerRect, contentRect, position) => {
  switch (position) {
    case "right":
      const left = triggerRect.left + triggerRect.width;
      const top = triggerRect.top;

      return { left, top };
    default:
      return;
  }
};