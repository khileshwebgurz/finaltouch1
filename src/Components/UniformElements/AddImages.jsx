import React, { useState } from "react";



//passing selected neck and it's id to the parent
export default function AddImages({gettingImages}) {

  // for showing or hiding the tab of neck options
  const [showAnswer, setShowAnswer] = useState(false);

  const handleTab = (tabName) => {
    if (tabName === "add-images-layer") {
      setShowAnswer(!showAnswer);
    }
  };

  // function for uploading and previewing images
 

  const handleChange = (e) => {
    gettingImages(URL.createObjectURL(e.target.files[0]));
    
  };

  const handleReset =()=>{
    gettingImages('')
  }
  

 

  return (
    <>
      <li className={`add-images ${showAnswer ? "active" : ""}`}>
        <h3 onClick={() => handleTab("add-images-layer")}>
          Add Images
        </h3>
        {showAnswer && (
          <div className="answer-wrap">
            <div className="answer">
            <div className="upload-image-wrap">
            <div className="upload-image-file" id="upload-image-file">
            <input type="text" name="" id="chosen-filename" readOnly />
            <label htmlFor="browse-image">
                <input type="file" name="browse-image" id="browse-image" onChange={handleChange} accept="image/*" />
                <span className="btn-design">Browse</span>
                </label>
              <button id="btn-reset" type="reset" onClick={handleReset} className="btn-design">Reset</button>
              </div>
            </div>
          </div>
          </div>
        )}
      </li>
    </>
  );
}
