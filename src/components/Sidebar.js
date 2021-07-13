import React from "react";
import Icon from "./Icon";

import * as Constants from "../Common/Constants";

export default function Sidebar(props) {
  return (
    <div className="w-60 flex-none h-full overflow-y-auto flex flex-col items-start p-2 border-r border-gray-200">
      <div className="font-bold"> {"Events"} </div>
      <div
        draggable={true}
        onDragStart={props.handleDragStart}
        onDragEnd={props.handleDragEnd}
        onMouseOver={props.handleHoverOver}
        onMouseOut={props.handleHoverOut}
        className="draggable flex flex-row flex-wrap bg-yellow-500 text-white px-2 py-1 my-2 text-sm cursor-pointer"
        name={Constants.Type_Event + ":" + Constants.Event_Type_Flagclicked}
        value=""
      >
        {"When "}
        <Icon name="flag" size={15} className="text-green-600 mx-2" />
        {"clicked"}
      </div>
      <div
        draggable={true}
        onDragStart={props.handleDragStart}
        onDragEnd={props.handleDragEnd}
        className="draggable flex flex-row flex-wrap bg-yellow-500 text-white px-2 py-1 my-2 text-sm cursor-pointer"
        name={Constants.Type_Event + ":" + Constants.Event_Type_Spriteclicked}
        value=""
      >
        {"When this sprite clicked"}
      </div>
      <div className="font-bold"> {"Motion"} </div>
      <div
        draggable={true}
        onDragStart={props.handleDragStart}
        onDragEnd={props.handleDragEnd}
        className="draggable flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer"
        name={Constants.Type_Motion + ":" + Constants.Motion_Type_Move}
        value="10"
      >
        {"Move 10 steps"}
      </div>
      <div
        draggable={true}
        onDragStart={props.handleDragStart}
        onDragEnd={props.handleDragEnd}
        className="draggable flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer"
        name={
          Constants.Type_Motion +
          ":" +
          Constants.Motion_Type_RotateAnticlockwise
        }
        value={"15"}
      >
        {"Turn "}
        <Icon name="undo" size={15} className="text-white mx-2" />
        {"15 degrees"}
      </div>
      <div
        draggable={true}
        onDragStart={props.handleDragStart}
        onDragEnd={props.handleDragEnd}
        className="draggable flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer"
        name={
          Constants.Type_Motion + ":" + Constants.Motion_Type_RotateClockwise
        }
        value={"15"}
      >
        {"Turn "}
        <Icon name="redo" size={15} className="text-white mx-2" />
        {"15 degrees"}
      </div>

      <div
        onClick={() => props.handleClick(Constants.Event_Type_Flagclicked)}
        className="draggable flex flex-row flex-wrap bg-yellow-500 text-white px-2 py-1 my-8 text-sm cursor-pointer"
      >
        Click for Flag
        <Icon name="flag" size={15} className="text-green-600 mx-2" />
      </div>

      <div
        onClick={() => props.handleClick(Constants.Event_Type_Flagclicked)}
        className="draggable flex flex-row flex-wrap bg-yellow-500 text-white px-2 py-1 my-8 text-sm cursor-pointer"
      >
        elements can be pulled in mid area but moving them in midarea might be
        ambiguous
      </div>
    </div>
  );
}
