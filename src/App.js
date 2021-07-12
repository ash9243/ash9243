import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import MidArea from "./components/MidArea";
import PreviewArea from "./components/PreviewArea";

export default function App() {
  const [selectedElement, setSelectedElement] = useState("");
  const [diffX, setDiffX] = useState(0);
  const [diffY, setDiffY] = useState(0);
  const [group, setGroup] = useState([]);

  useEffect(() => {
    console.log("selected element changed");
  }, [selectedElement]);

  const handleDragStart = (event) => {
    console.log("drag start ");

    // console.log("class list", event.currentTarget.classList);
    console.log("previous selected element is ", selectedElement);
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
      console.log("inside copy");
      newElement = event.currentTarget.cloneNode(true);
      newElement.style.position = "absolute";
      newElement.addEventListener("dragstart", handleDragStart);
      newElement.addEventListener("dragend", handleDragEnd);
    } else {
      console.log("inside move");
      newElement = event.currentTarget;
      // console.log("event current target", event.currentTarget);
    }

    setDiffX(event.clientX - event.currentTarget.getBoundingClientRect().left);
    setDiffY(event.clientY - event.currentTarget.getBoundingClientRect().top);
    setSelectedElement(newElement);
  };

  const handleDragEnd = (event) => {
    console.log("drag end");

    let newElement = selectedElement;

    console.log("new element is", newElement);

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
      let group1 = [];
      group1.push({
        dragElement: newElement,
        group: 1,
        position: 1
      });
      setGroup(group1);

      newElement.classList.add("group1");
      newElement.classList.add("position1");
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
          }

          // check if in range for top attachment
          if (CEB > EET - 0.5 * elHeight && CEB < EET + 0.5 * elHeight) {
            newElement.style.top = EET - elHeight - 1 + "px";
            newElement.style.left = EEL + "px";
          }
        }
      }
      //elsewhere
      //create new group and add to it
    }
  };

  const handleDragOver = () => {
    console.log("drag over");
  };

  const handleDrop = () => {
    console.log("element dropped");
  };

  return (
    <div className="bg-blue-100 pt-6 font-sans">
      <div className="h-screen overflow-hidden flex flex-row  ">
        <div className="flex-1 h-screen overflow-hidden flex flex-row bg-white border-t border-r border-gray-200 rounded-tr-xl mr-2">
          <Sidebar
            handleDragStart={handleDragStart}
            handleDragEnd={handleDragEnd}
          />
          <MidArea handleDragOver={handleDragOver} handleDrop={handleDrop} />
        </div>
        <div className="w-1/3 h-screen overflow-hidden flex flex-row bg-white border-t border-l border-gray-200 rounded-tl-xl ml-2">
          <PreviewArea />
        </div>
      </div>
    </div>
  );
}
