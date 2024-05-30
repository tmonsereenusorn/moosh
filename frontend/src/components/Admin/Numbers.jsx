import React from "react";
import kpiFetching from "../../api/kpis/kpiFetching";

const Numbers = () => {
  return (
    <div className="flex flex-col w-full border border-surface[/.4] rounded-xl p-2">
      <div>MOOSH by the numbers</div>
      <div>In the last 30 days:</div>
      <div
        className="text-xl hover:cursor-pointer"
        onClick={kpiFetching.getActionCount()}
      >
        GET
      </div>
      <div>x prompts submitted</div>
      <div>x playlists regenerated</div>
      <div>x playlists exported</div>
      <div>x curator sessions</div>
    </div>
  );
};

export default Numbers;
