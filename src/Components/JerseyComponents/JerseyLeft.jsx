import React, { useRef, useEffect } from "react";
import JerseyCustomisableData from "../../utils/jerseyCustomisableData.js";
const JerseyLeft = ({ selectedvorNovImg, shapeColors }) => {


  const jersyNum = localStorage.getItem("selectedJersy");
  const leftSideStripes = `assets/jerseys/${jersyNum}/slicings/leftside-stripes.png`;
  const leftsideShoulder = `assets/jerseys/${jersyNum}/slicings/leftside-shoulder.png`;
  const leftsideCollar = `assets/jerseys/${jersyNum}/slicings/leftside-collar.png`;

  let shirtImagebg = ``;

  if (selectedvorNovImg.includes("crew_leftside")) {
    shirtImagebg = `assets/jerseys/${jersyNum}/slicings/crew_leftsidebg.png`;
  } else {
    shirtImagebg = `assets/jerseys/${jersyNum}/slicings/crew_noV_leftsidebg.png`;
  }


    // getting all the stripes based on uniform layers
    const stripesNum = JerseyCustomisableData[jersyNum].uniform_layers;

    // storing all the stripes in the stripeImages array
  const stripeImages = [];
  for (let i = 2; i < stripesNum ; i++) {
    stripeImages.push(
      `assets/jerseys/${jersyNum}/slicings/leftside-stripes-${i}.png`
    );
  }
  const canvasRef = useRef(null);

  const loadImages = async (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = (error) => {
        console.error("Image loading failed:", img);
        reject(error);
      };
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d", { willReadFrequently: true });

    const drawImages = async () => {
      try {
        const [
          leftImg,
          leftSideStripeImg,
          leftSideShoulderImg,
          leftSideCollarImg,
          shirtImgBg,
          ...additionalStripes
        ] = await Promise.all([
          loadImages(selectedvorNovImg),
          loadImages(leftSideStripes),
          loadImages(leftsideShoulder),
          loadImages(leftsideCollar),
          loadImages(shirtImagebg),
           // loading all the images one by one from the stripeImages array
           ...stripeImages.map((src) => loadImages(src)),
        ]);

        context.clearRect(0, 0, canvas.width, canvas.height);

        // default shirt
        context.drawImage(leftImg, 10, 0, 300, 600);
        let imageData = context.getImageData(10, 0, 300, 600);
        imageData = changeColor(imageData, shapeColors.shirt1);
        context.putImageData(imageData, 10, 0);

        // Draw other default images
        const defaultImages = [
          {
            image: leftSideStripeImg,
            color: shapeColors.shirt2,
            position: [10, 0],
          },
          {
            image: leftSideCollarImg,
            color: shapeColors.neck1,
            position: [10, 0],
          },
          {
            image: leftSideShoulderImg,
            color: shapeColors.shoulder1,
            position: [10, 0],
          },
        ];

         // now adding all the additional stripes to my Images array so that it can used inside
        // the temporary canvas
        additionalStripes.forEach((stripeImg, index) => {
          // starting with 3 bcz we already have base image and 1 stripe
          const colorKey = `shirt${index + 3}`;
          defaultImages.push({
            image: stripeImg,
            color: shapeColors[colorKey],
            position: [10, 0],
          });
        });

        defaultImages.forEach(({ image, color, position }) => {
          const tempCanvas = document.createElement("canvas");
          tempCanvas.width = 300;
          tempCanvas.height = 600;
          const tempContext = tempCanvas.getContext("2d");
          tempContext.drawImage(image, 0, 0, 300, 600);
          let tempImageData = tempContext.getImageData(0, 0, 300, 600);
          tempImageData = changeColor(tempImageData, color);
          tempContext.putImageData(tempImageData, 0, 0);
          context.drawImage(tempCanvas, ...position);
        });
        // background Img
        context.drawImage(shirtImgBg, 10, 0, 300, 600);
      } catch (error) {
        console.error("Error loading images:", error);
      }
    };

    drawImages();
  }, [selectedvorNovImg, shapeColors]);

  const changeColor = (imageData, color) => {
    const { data } = imageData;
    const hexColor = color.replace(/^#/, ""); // Remove '#' if present
    const [r, g, b] = hexColor.match(/.{1,2}/g).map((c) => parseInt(c, 16));
    for (let i = 0; i < data.length; i += 4) {
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
    }
    return imageData;
  };
  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={600}
      // style={{ border: "1px solid black" }}
    />
  );
};

export default JerseyLeft;
