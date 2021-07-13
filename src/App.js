import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import MidArea from "./components/MidArea";
import PreviewArea from "./components/PreviewArea";

import * as Constants from "./Common/Constants";

export default function App() {
  const [selectedElement, setSelectedElement] = useState("asdnksandmasndm,a");
  const [diffX, setDiffX] = useState(0);
  const [diffY, setDiffY] = useState(0);
  const [groups, setGroups] = useState({});

  useEffect(() => {
    console.log("groups", groups);
  }, [groups]);

  const handleDragStart = (event) => {
    event.persist();
    // console.log("drag start ");

    // console.log("class list", event.currentTarget.classList);
    // console.log("previous selected element is ", selectedElement);
    // let functionalityType = "";
    let newElement = "";
    // let classList = event.currentTarget.classList;
    // for (let i = 0; i < classList.length; i++) {
    //move element
    // if (classList[i].includes("group")) {
    // functionalityType = "move";
    // break;
    // }
    // }

    // if (functionalityType !== "move") {
    // console.log("inside copy");
    console.log("event is ", event);
    console.log("event target name", event.currentTarget.name);
    console.log("event target value", event.currentTarget.value);
    console.log("event target name", event.target.name);

    newElement = event.currentTarget.cloneNode(true);
    newElement.style.position = "absolute";
    newElement.addEventListener("dragstart", handleDragStart);
    newElement.addEventListener("dragend", handleDragEnd);
    newElement.addEventListener("mouseover", handleHoverOver);
    newElement.addEventListener("mouseout", handleHoverOut);
    // }
    // else {
    // console.log("inside move");
    // newElement = event.currentTarget;
    // console.log("event current target", event.currentTarget);
    // }

    setDiffX(event.clientX - event.currentTarget.getBoundingClientRect().left);
    setDiffY(event.clientY - event.currentTarget.getBoundingClientRect().top);
    // console.log("new element in drag start ", newElement);
    setSelectedElement(newElement);
  };

  const handleDragEnd = (event) => {
    // console.log("drag end");

    let newElement = selectedElement;

    // console.log("new element drag end", newElement);

    newElement.style.top = event.clientY - diffY + "px";
    newElement.style.left = event.clientX - diffX + "px";

    let elements = document
      .getElementById("MidArea")
      .querySelectorAll(".draggable");

    // console.log("elememnts is ", elements);

    document.getElementById("MidArea").appendChild(newElement);

    newElement.classList.remove("my-2");

    if (elements.length === 0) {
      newElement.group = "group1";

      fillElementDetails(newElement);
      newElement.elementType = newElement.name;
      addToGroup(newElement.group, newElement, "newGroup");
    } else {
      for (let i = 0; i < elements.length; i++) {
        let currentElement = newElement;
        let existingElement = elements[i];

        let CET = currentElement.getBoundingClientRect().top;
        let CEL = currentElement.getBoundingClientRect().left;
        let CEB = currentElement.getBoundingClientRect().bottom;

        let EET = existingElement.getBoundingClientRect().top;
        let EEL = existingElement.getBoundingClientRect().left;
        let EEB = existingElement.getBoundingClientRect().bottom;

        let elHeight = currentElement.getBoundingClientRect().height;
        let elWidth = currentElement.getBoundingClientRect().width;

        // check if in range of x direction
        if (CEL > EEL - 0.25 * elWidth && CEL < EEL + 1.25 * elWidth) {
          // check if in range for bottom attachment
          if (CET > EET + 0.5 * elHeight && CET < EET + 1.5 * elHeight) {
            newElement.style.top = EEB + 1 + "px";
            newElement.style.left = EEL + "px";

            newElement.group = existingElement.group;

            console.log("existing element group ", existingElement.group);
            addToGroup(newElement.group, newElement, "endGroup");

            return;
          }

          // check if in range for top attachment
          if (CEB > EET - 0.5 * elHeight && CEB < EET + 0.5 * elHeight) {
            newElement.style.top = EET - elHeight - 1 + "px";
            newElement.style.left = EEL + "px";

            newElement.group = existingElement.group;
            console.log("existing element group ", existingElement.group);

            addToGroup(newElement.group, newElement, "startGroup");

            return;
          }
        }
      }

      let groupLength = Object.keys(groups).length;
      newElement.group = `group${groupLength + 1}`;

      addToGroup(newElement.group, newElement, "newGroup");

      //elsewhere
      //create new group and add to it
    }
  };

  const fillElementDetails = (newElement) => {
    console.log("new element name", newElement.name);
    console.log("new element value", newElement.value);

    let name = newElement.name.split(":");
    let value = newElement.value;
    let elementType = "";
    let elementEventType = "";
    let elementMotionType = "";
    let elementMotionMoveValue = "";
    let elementRotateAnticlockwiseValue = "";
    let elementRotatateClockwiseValue = "";

    elementType = name[0];

    if (elementType === Constants.Type_Event) {
      elementEventType = name[1];
    } else {
      elementMotionType = name[1];
    }

    if (elementMotionType === Constants.Motion_Type_Move) {
      elementMotionMoveValue = value;
    } else if (
      elementMotionType === Constants.Motion_Type_RotateAnticlockwise
    ) {
      elementRotateAnticlockwiseValue = value;
    } else {
      elementRotatateClockwiseValue = value;
    }

    newElement.elementType = elementType;
    newElement.elementEventType = elementEventType;
    newElement.elementMotionType = elementMotionType;
    newElement.elementMotionMoveValue = elementMotionMoveValue;
    newElement.elementRotateAnticlockwiseValue = elementRotateAnticlockwiseValue;
    newElement.elementRotatateClockwiseValue = elementRotatateClockwiseValue;
  };

  const addToGroup = (groupName, newElement, addType) => {
    let obj = { ...groups };
    if (Object.keys(obj).length === 0) {
      obj[groupName] = addNewGroup(newElement);
    } else {
      let objGroup = [];

      if (obj[groupName]) {
        objGroup = [...obj[groupName]];
      }

      if (addType === "newGroup") {
        objGroup = addNewGroup(newElement);
      } else if (addType === "startGroup") {
        objGroup = [newElement, ...objGroup];
      } else if (addType === "endGroup") {
        objGroup = [...objGroup, newElement];
      } else {
      }

      obj[groupName] = objGroup;
    }

    setGroups(obj);
  };

  const addNewGroup = (newElement) => {
    let groupNew = [];
    groupNew.push({
      dragElement: newElement
    });

    return groupNew;
  };

  const handleHoverOver = (event) => {
    // event.currentTarget.style.backgroundColor = "red";
    // let existingElement = event.currentTarget.cloneNode(true);
    // let groupName = existingElement.name;
    // let obj = { ...groups };
    // let elementNew = {
    //   dragElement: existingElement
    // };
    // obj[groupName] = [...obj[groupName], elementNew];
    // existingElement.name = `${groupName}`;
    // existingElement.style.opacity = "0.3";
    // console.log("new element name", existingElement.name);
    // setGroups(obj);
  };

  const handleHoverOut = (event) => {
    // console.log("hover out", event.currentTarget.name);
    // event.currentTarget.style.opacity = "1";
  };

  const handleDragOver = () => {
    console.log("drag over");
  };

  const handleDrop = () => {
    console.log("element dropped");
  };

  const performOperations = () => {
    let stateGroups = { ...groups };

    let groupKeys = Object.keys(stateGroups);

    console.log("state groups ", groupKeys);
    for (let i = 0; i < groupKeys.length; i++) {
      console.log("keys ", groupKeys[i]);
      console.log("value", stateGroups[groupKeys[i]]);
      let groupArr = stateGroups[groupKeys[i]];
      for (let j = 0; j < groupArr.length; j++) {
        console.log("element name", groupArr[i].elementType);
      }
    }

    // performRotation(90);
    // performMovement();
  };

  const performRotation = (degree) => {
    let catSprite = document.getElementById("catSprite");
    let rotation = findRotation(catSprite);
    let trans = rotation + degree;
    catSprite.style.transform = `rotate(${trans}deg)`;
  };

  const findRotation = (catSprite) => {
    let rotation = catSprite.style.transform
      ? catSprite.style.transform.split("(")[1].replace("deg)", "")
      : 0;
    return parseInt(rotation, 10);
  };

  const performMovement = (steps) => {
    let catSpriteDiv = document.getElementById("catSpriteDiv");

    let catX = 0;
    let catY = 0;

    let rotation = findRotation(document.getElementById("catSprite"));
    let cosX = Math.cos(rotation * (Math.PI / 180));
    let sinX = Math.sin(rotation * (Math.PI / 180));

    //need to find using sin and cosin
    let x = steps * cosX;
    let y = steps * sinX;

    let splitArr = [];

    if (catSpriteDiv.style.transform) {
      splitArr = catSpriteDiv.style.transform
        .replace("translate(", "")
        .replace("px", "")
        .replace("px", "")
        .replace(")", "")
        .replace(" ", "")
        .split(",");

      catX = parseInt(splitArr[0], 10);
      catY = parseInt(splitArr[1], 10);
    }

    console.log("cat x ", catX);
    console.log("cat y", catY);
    catSpriteDiv.style.transform = `translate(
      ${catX + x}px,
      ${catY + y}px
      )`;
  };

  return (
    <div className="bg-blue-100 pt-6 font-sans">
      <div className="h-screen overflow-hidden flex flex-row  ">
        <div className="flex-1 h-screen overflow-hidden flex flex-row bg-white border-t border-r border-gray-200 rounded-tr-xl mr-2">
          <Sidebar
            handleDragStart={handleDragStart}
            handleDragEnd={handleDragEnd}
            handleHoverOver={handleHoverOver}
            handleHoverOut={handleHoverOut}
          />
          <MidArea handleDragOver={handleDragOver} handleDrop={handleDrop} />
        </div>
        <div className="w-1/3 h-screen overflow-hidden flex flex-row bg-white border-t border-l border-gray-200 rounded-tl-xl ml-2">
          <PreviewArea handleClick={performOperations} />
        </div>
      </div>
    </div>
  );
}
