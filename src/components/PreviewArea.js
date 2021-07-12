import React from "react";
import CatSprite from "./CatSprite";

export default function PreviewArea(props) {
  return (
    <div id="catSpriteDiv" className="flex-none h-full overflow-y-auto p-2">
      <CatSprite handleClick={props.handleClick} />
    </div>
  );
}
