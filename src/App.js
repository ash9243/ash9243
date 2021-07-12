import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import MidArea from "./components/MidArea";
import PreviewArea from "./components/PreviewArea";

export default function App() {
  const [selectedElement, setSelectedElement] = useState("asdnksandmasndm,a");
  const [diffX, setDiffX] = useState(0);
  const [diffY, setDiffY] = useState(0);
  const [groups, setGroups] = useState({});

  useEffect(() => {
    console.log("groups", groups);
  }, [groups]);

  const handleDragStart = (event) => {
    console.log("drag start ");

    // console.log("class list", event.currentTarget.classList);
    // console.log("previous selected element is ", selectedElement);
    let functionalityType = "";
    let newElement = "";
    let classList = event.currentTarget.classList;
    for (let i = 0; i < classList.length; i++) {
      //move element
      if (classList[i].includes("group")) {
        functionalityType = "move";
        break;
      }
    }

    if (functionalityType !== "move") {
      // console.log("inside copy");
      newElement = event.currentTarget.cloneNode(true);
      newElement.style.position = "absolute";
      newElement.addEventListener("dragstart", handleDragStart);
      newElement.addEventListener("dragend", handleDragEnd);
      newElement.addEventListener("mouseover", handleHoverOver);
      newElement.addEventListener("mouseout", handleHoverOut);
    } else {
      // console.log("inside move");
      newElement = event.currentTarget;
      // console.log("event current target", event.currentTarget);
    }

    setDiffX(event.clientX - event.currentTarget.getBoundingClientRect().left);
    setDiffY(event.clientY - event.currentTarget.getBoundingClientRect().top);
    // console.log("new element in drag start ", newElement);
    setSelectedElement(newElement);
  };

  const handleDragEnd = (event) => {
    console.log("drag end");

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
      // console.log("first element to be added");

      let obj = { ...groups };

      let groupNew = [];
      groupNew.push({
        dragElement: newElement
      });

      obj.group1 = groupNew;
      setGroups(obj);

      newElement.classList.add("group1");
      newElement.classList.add("position1");
      newElement.name = "group1:position1";
    } else {
      //attach on top or bottom
      //add to existing group

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

            let groupName = existingElement.name;
            let obj = { ...groups };

            let elementNew = {
              dragElement: newElement,
              group: 1,
              position: 1
            };

            obj[groupName] = [...obj[groupName], elementNew];
            newElement.name = `${groupName}`;
            console.log("new element name", newElement.name);

            setGroups(obj);
            return;
            // console.log("existing element name", existingElement.name);
          }

          // check if in range for top attachment
          if (CEB > EET - 0.5 * elHeight && CEB < EET + 0.5 * elHeight) {
            newElement.style.top = EET - elHeight - 1 + "px";
            newElement.style.left = EEL + "px";

            let groupName = existingElement.name;
            let obj = { ...groups };

            let elementNew = {
              dragElement: newElement,
              group: 1,
              position: 1
            };

            obj[groupName] = [elementNew, ...obj[groupName]];

            newElement.name = `${groupName}`;
            console.log("new element name", newElement.name);

            setGroups(obj);
            return;
          }
        }
      }

      let obj = { ...groups };

      let groupNew = [];
      groupNew.push({
        dragElement: newElement
      });

      let groupLength = Object.keys(obj).length;
      newElement.name = `group${groupLength + 1}`;
      let groupName = newElement.name;
      console.log("elemet name in true", newElement.name);
      obj[groupName] = groupNew;

      setGroups(obj);

      //elsewhere
      //create new group and add to it
    }
  };

  const handleHoverOver = (event) => {
    // event.currentTarget.style.backgroundColor = "red";

    let existingElement = event.currentTarget.cloneNode(true);

    let groupName = existingElement.name;
    let obj = { ...groups };

    let elementNew = {
      dragElement: existingElement
    };

    obj[groupName] = [...obj[groupName], elementNew];
    existingElement.name = `${groupName}`;
    existingElement.style.opacity = "0.3";
    console.log("new element name", existingElement.name);

    setGroups(obj);
  };

  const handleHoverOut = (event) => {
    console.log("hover out", event.currentTarget.name);
    event.currentTarget.style.opacity = "1";
  };

  const handleDragOver = () => {
    console.log("drag over");
  };

  const handleDrop = () => {
    console.log("element dropped");
  };

  const performOperations = () => {
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
