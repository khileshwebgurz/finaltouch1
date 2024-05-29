import React, { useState } from "react";
import NeckImgeList from "../UniformStore/NeckStore";

//passing selected neck and it's id to the parent
export default function Neck({ onNeckSelect }) {
  // for showing or hiding the tab of neck options
  const [showAnswer, setShowAnswer] = useState(false);

  const handleTab = (tabName) => {
    if (tabName === "neck-style-layer") {
      setShowAnswer(!showAnswer);
    }
  };

  //function for selectedNeck adn its id
  const handleNeckImageClick = (NeckData) => {
    onNeckSelect(NeckData);
  };

  return (
    <>
      <li className={`${showAnswer ? "active" : ""} neck-style `}>
        <h3 onClick={() => handleTab("neck-style-layer")}>
          Choose Your Neck Style
        </h3>

        {/* if tab is open then map through all neck image list and apply handleselectedneck image click */}
        {showAnswer && (
          <div className="answer-wrap">
            <div className="answer">
              <div className="customize-prod-list scrollbar">
                <ul className="list-unstyled">
                  {NeckImgeList.map((neckimge) => (
                    
                    <li
                      key={neckimge.id}
                      onClick={() =>
                        handleNeckImageClick({
                          NeckImg: neckimge.src,
                          NeckClr: neckimge.clrImg1,
                          NeckImgShd: neckimge.shd,
                          NeckId: neckimge.id,
                        })
                      }
                    >
                     
                      <div
                        id="collar-img"
                        className={`detail zoomNeck highlightNeck`}
                      >
                        <figure>
                          <img src={neckimge.src} alt="" />
                        </figure>
                        <div className="uniform-tag">N{neckimge.id}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </li>
    </>
  );
}
