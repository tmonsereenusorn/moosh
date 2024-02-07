import React, { useEffect, useState } from "react";
import CuratorInput from "../../components/CuratorInput";

const Curator = () => {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(false);

  const onChangeText = (event) => {
    console.log(event.target.value);
    setQuery(event.target.value);
  };

  const onSubmit = () => {
    console.log("clicked");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-2/3 h-screen flex items-end justify-center">
        <CuratorInput
          onSubmit={onSubmit}
          onChangeText={(event) => onChangeText(event)}
        />
      </div>
    </div>
  );
};

export default Curator;
