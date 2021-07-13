import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import MidArea from "./components/MidArea";
import PreviewArea from "./components/PreviewArea";

import * as Constants from "./Common/Constants";

export default function App() {
  const [selectedElement, setSelectedElement] = useState("");
  const [diffX, setDiffX] = useState(0);
  const [diffY, setDiffY] = useState(0);
  const [groups, setGroups] = useState({});
  const [removedElement, setRemovedElement] = useState("");
  const [selectedId, setSelectedId] = useState("");
  let localSelectedId = "";

  useEffect(() => {
    console.log("groups", groups);
  }, [groups]);

  const handleDragStart = (event) => {
    let functionalityType = "";
    let newElement = "";

    if (event.currentTarget.group) {
      functionalityType = "move";
    }
    // if (functionalityType !== "move") {
    newElement = event.currentTarget.cloneNode(true);
    newElement.style.position = "absolute";
    newElement.addEventListener("dragstart", handleDragStart);
    newElement.addEventListener("dragend", handleDragEnd);
    newElement.addEventListener("mouseover", handleHoverOver);
    newElement.addEventListener("mouseout", handleHoverOut);
    // }
    if (functionalityType === "move") {
      //check for last element

      setRemovedElement(event.currentTarget);
      setSelectedId(event.currentTarget.id);
      localSelectedId = event.currentTarget.id;
    } else {
      setSelectedId("");
      setRemovedElement("");
      localSelectedId = "";
    }

    setDiffX(event.clientX - event.currentTarget.getBoundingClientRect().left);
    setDiffY(event.clientY - event.currentTarget.getBoundingClientRect().top);
    setSelectedElement(newElement);
  };

  const checkGroups = (element) => {
    let obj = { ...groups };
    let idArr = element.id.split(":");
    let groupName = idArr[0];
    let position = idArr[1];

    if (obj[groupName].length === 1) {
      //destroy the whole group
      delete obj[groupName];
    } else if (position === obj[groupName].length) {
      obj[groupName].pop();
    }

    setGroups(obj);
  };

  const topOrMiddle = (element) => {
    let obj = { ...groups };
    let idArr = element.id.split(":");
    let groupName = idArr[0];
    let position = idArr[1];

    if (obj[groupName].length === 1) {
      return false;
    } else {
      if (position === 1) {
        return true;
      } else if (position < obj[groupName].length) {
        return true;
      }
    }
  };

  const handleDragEnd = (event) => {
    let newElement = "";

    if (localSelectedId !== "") {
      newElement = document.getElementById(localSelectedId);

      //check and remove groups
      if (topOrMiddle(newElement)) {
        return;
      }

      checkGroups(newElement);
    } else {
      newElement = selectedElement;
    }

    newElement.style.top = event.clientY - diffY + "px";
    newElement.style.left = event.clientX - diffX + "px";

    let elements = document
      .getElementById("MidArea")
      .querySelectorAll(".draggable");

    document.getElementById("MidArea").appendChild(newElement);

    let MABR = document.getElementById("MidArea").getBoundingClientRect();

    let NEBR = newElement.getBoundingClientRect();

    if (
      NEBR.left < MABR.left ||
      NEBR.top < MABR.top ||
      NEBR.right > MABR.right ||
      NEBR.bottom > MABR.bottom
    ) {
      newElement.remove();
      return;
    }

    newElement.classList.remove("my-2");

    if (elements.length === 0) {
      newElement.group = "group1";
      newElement.position = 1;
      console.log("new element", newElement.getBoundingClientRect());
      let returnedElement = fillElementDetails(newElement);
      returnedElement.id = newElement.group + ":" + newElement.position;
      addToGroup(returnedElement.group, returnedElement, "newGroup");
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
        if (CEL > EEL - elWidth && CEL < EEL + 2 * elWidth) {
          // check if in range for bottom attachment
          if (CET > EET + 0.5 * elHeight && CET < EET + 2 * elHeight) {
            let returnedElement = fillElementDetails(newElement);

            if (returnedElement.elementType === Constants.Type_Event) {
              returnedElement.remove();
              return;
            }

            if (groups[existingElement.group][existingElement.position]) {
              returnedElement.remove();
              return;
            }

            returnedElement.style.top = EEB + 1 + "px";
            returnedElement.style.left = EEL + "px";

            returnedElement.group = existingElement.group;
            returnedElement.position = existingElement.position + 1;

            returnedElement.id =
              returnedElement.group + ":" + returnedElement.position;

            addToGroup(returnedElement.group, returnedElement, "endGroup");

            return;
          }

          // check if in range for top attachment
          if (CEB > EET - elHeight && CEB < EET + 0.5 * elHeight) {
            if (existingElement.elementType === Constants.Type_Event) {
              newElement.remove();
              return;
            }

            if (groups[existingElement.group][existingElement.position - 2]) {
              newElement.remove();

              return;
            }

            newElement.style.top = EET - elHeight - 1 + "px";
            newElement.style.left = EEL + "px";

            newElement.group = existingElement.group;
            newElement.position = 1;
            incrementPosition(newElement.group);

            let returnedElement = fillElementDetails(newElement);
            returnedElement.id =
              returnedElement.group + ":" + returnedElement.position;

            addToGroup(returnedElement.group, returnedElement, "startGroup");

            return;
          }
        }
      }

      let groupLength = Object.keys(groups).length;
      newElement.group = `group${groupLength + 1}`;
      newElement.position = 1;

      let returnedElement = fillElementDetails(newElement);
      returnedElement.id =
        returnedElement.group + ":" + returnedElement.position;

      addToGroup(returnedElement.group, returnedElement, "newGroup");

      //elsewhere
      //create new group and add to it
    }
  };

  const incrementPosition = (groupName) => {
    let objGroup = [...groups[groupName]];

    for (let i = 0; i < objGroup.length; i++) {
      objGroup[i].position = objGroup[i].position + 1;
    }

    groups[groupName] = objGroup;

    setGroups(groups);
  };

  const fillElementDetails = (newElement) => {
    let name = newElement.attributes["name"].value.split(":");
    let value = newElement.attributes["value"].value;
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

    return newElement;
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
    groupNew.push(newElement);

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
    // setGroups(obj);
  };

  const handleHoverOut = (event) => {
    // event.currentTarget.style.opacity = "1";
  };

  const handleDragOver = () => {};

  const handleDrop = () => {};

  const performOperations = (eventType) => {
    let stateGroups = { ...groups };

    let groupKeys = Object.keys(stateGroups);

    for (let i = 0; i < groupKeys.length; i++) {
      let groupArr = stateGroups[groupKeys[i]];
      if (
        groupArr[0].elementType === Constants.Type_Event &&
        groupArr[0].elementEventType === eventType
      ) {
        for (let j = 1; j < groupArr.length; j++) {
          performMotion(groupArr[j]);
          sleep(1000);
        }
      }
    }
  };

  const sleep = (milliseconds) => {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if (new Date().getTime() - start > milliseconds) {
        break;
      }
    }
  };

  const performMotion = (element) => {
    //motion
    if (element.elementType === Constants.Type_Motion) {
      //move steps
      if (element.elementMotionType === Constants.Motion_Type_Move) {
        performMovement(parseInt(element.elementMotionMoveValue, 10));
      }
      //rotate anticlockwise
      else if (
        element.elementMotionType === Constants.Motion_Type_RotateAnticlockwise
      ) {
        performRotation(
          parseInt(element.elementRotateAnticlockwiseValue, 10) * -1
        );
      }
      //rotate clockwise
      else {
        performRotation(parseInt(element.elementRotatateClockwiseValue, 10));
      }
    }
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
            handleClick={performOperations}
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
