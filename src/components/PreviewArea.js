import React from "react";
import CatSprite from "./CatSprite";

import * as Constants from "../Common/Constants";
export default function PreviewArea(props) {
  return (
    <div id="catSpriteDiv" className="flex-none h-full overflow-y-auto p-2">
      <CatSprite
        handleClick={() =>
          props.handleClick(Constants.Event_Type_Spriteclicked)
        }
      />
    </div>
  );
}
