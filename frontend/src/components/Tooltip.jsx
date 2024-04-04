import React, { useState } from "react";

const Tooltip = ({ children, text }) => {
    const [isHovered, setIsHovered] = useState(false);
  
    return (
      <div className="relative flex items-center">
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {children}
        </div>
        {isHovered && (
          <div style={{ width: '150px' }}className="text-center absolute bg-black text-white text-sm py-2 px-4 rounded-lg z-10 left-full ml-2">
            {text}
          </div>
        )}
      </div>
    );
  };

  export default Tooltip;