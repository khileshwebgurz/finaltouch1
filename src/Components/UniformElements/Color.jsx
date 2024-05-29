import React, { useState } from "react";
import allColors from "../../utils/colors.js";
import JerseyCustomisableData from "../../utils/jerseyCustomisableData.js";

// onColorSelect is for passing the selected color and selectedNeckId is for getting the selectedNeck from neck options 
export default function Color({ onColorSelect, selectedNeckId }) {

  // getting the selected Jersey from the localstorage
  const selectedJersy = localStorage.getItem("selectedJersy");

  // now getting all data associated to a particular jersey
  const jerseyData = JerseyCustomisableData[selectedJersy];

  //state for showing and hiding color palette
  const [showColor, setShowColor] = useState("");

  const handleShowColor = (palette) => {
    if (showColor === palette) {
      setShowColor("");
    } else {
      setShowColor(palette);
    }
  };


  // state and function for showing and hiding color tabs
  const [showAnswer, setShowAnswer] = useState(false);

  const handleTab = (event) => {
    if (event === "color-uniform-layer") {
      setShowAnswer(!showAnswer);
    }
  };


  // passing the selected color to parent as a callback function
  const handleColor = (color, area) => {
   
    onColorSelect(color, area); 
  };


  // function is called here , with area as shirt, neck, shoulder . buttonText for label . Layer for number of color buttons
  // and selectedNeckId for selected neck
  const renderColorSelection = (area, buttonText, layers,selectedNeckId) => {
    const colorAreas = [];
  

    // created variable that store layers of neck
    let neckLayers = layers;

    // if neck is selected and it is from 2,4,12 . The parseInt function is used because the selectedNeckId might be a string, and you want to compare it with the numeric values in the array
    if (selectedNeckId && [2, 4, 12].includes(parseInt(selectedNeckId))) {
      //set neckLayers to 2 else 1
      neckLayers = 2;
    }
    else{
      neckLayers = 1;
    }

    // start a loop if area is neck then use neckLayers else use layers for shoulder and shirt
    for (let i = 1; i <= (area === "neck" ? neckLayers : layers); i++) {

      // then push all these buttons inside the colorAreas array
      colorAreas.push(
        <div style={{display: "flex", flexDirection: "column"}} key={i}>
          {/* this is the label let say shirt1 , shirt2 , neck1 , neck3 */}
          <span >{buttonText} {i}</span>
          {/* this is the button for handling to show or hide color platte */}
          <input
            type="button"
            style={{
              backgroundColor: "#fff",
              height: "30px",
              width: "30px",
              marginRight: "250px",
            }}
            onClick={() => handleShowColor(area + i)}
          />
          {/* when showColor is equal to shirt1 or shirt2 or neck1 or neck2 or shoulder1 then that particualr color platte is shown */}
          {showColor === area + i && (
            <div className="color-row">
              {allColors.map((color, index) => (
                <input
                  key={index}
                  type="button"
                  style={{
                    backgroundColor: color,
                    height: "15px",
                    width: "15px",
                  }}
                  onClick={(e) => handleColor(color, area+i)} // Pass area without index eg shirt1 , shirt2 
                />
              ))}
            </div>
          )}
        </div>
      );
    }
    return colorAreas;
  };

  return (
    <>
      <li className={`color-uniform ${showAnswer ? "active" : ""}`}>
        <h3 onClick={() => handleTab("color-uniform-layer")}>Color Uniform</h3>
        {/* if showAnswer is true means tab is open then */}
        {showAnswer && (
          <div className="answer-wrap">
            <div className="answer">
              <div className="customize-prod-list scrollbar">
                {/* run this function for 3 times bcz we have section for shirt , neck and shoulder */}
                {/* 3rd parameter is for getting the layers to decide the number of color button to show */}
                {/* but for neck we also have selectedNeckId */}
                <div className="wraper">
                <h4 className="customize-heading">Uniform Colors</h4>
                <div className="color-row">
                <div className="color-col">
                <div className="color-info">
                {renderColorSelection("shirt", "Color", jerseyData.uniform_layers)}
                </div>
                </div>
                </div>
                </div>



               <div className="wraper">
                <h4 className="customize-heading">Neck Colors</h4>
                <div className="color-row">
                <div className="color-col">
                <div className="color-info">
                {renderColorSelection("neck", " Color", jerseyData.neck_style,selectedNeckId)}
                </div>
                </div>
                </div>
                </div>
                

                <div className="wraper">
                <h4 className="customize-heading">Shoulders Colors</h4>
                <div className="color-row">
                <div className="color-col">
                <div className="color-info">
                {renderColorSelection("shoulder", "Color", jerseyData.shoulder_layers)}
                </div>
                </div>
                </div>
                </div>
                
                
                
                
              </div>
            </div>
          </div>
        )}
      </li>
    </>
  );
}
