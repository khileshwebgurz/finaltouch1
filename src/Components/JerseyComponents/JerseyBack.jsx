import React, { useRef, useEffect } from "react";
import JerseyCustomisableData from "../../utils/jerseyCustomisableData.js";

// here shapeColors and selectedShoulderImage are props so this is selected color and shoulderImage
const JerseyBack = ({ selectedShoulderImage, shapeColors }) => {

  // taking the useRef 
  const canvasRef = useRef(null);

  // intializing the shirtImage variable
  let shirtImage = ``;

  //getting the value of selectedJersey
  const jersyNum = localStorage.getItem("selectedJersy");

  //conditionally getting the jersey based on narrow or wide
  if (selectedShoulderImage.includes("narrow")) {
    shirtImage = `assets/jerseys/${jersyNum}/slicings/crew_back_narrow_shoulder.png`;
  } else {
    shirtImage = `assets/jerseys/${jersyNum}/slicings/crew_back_wide_shoulder.png`;
  }

  //using bg image of shirt to make it visible
  const shirtBg = `assets/jerseys/${jersyNum}/slicings/crew_back_narrow_shoulderbg.png`;


    // getting all the stripes based on uniform layers for particular selected Jersey
    const stripesNum = JerseyCustomisableData[jersyNum].uniform_layers;

    // getting all common backstripe and backcollar image 
  const backStripes = `assets/jerseys/${jersyNum}/slicings/back-stripes.png`;
  const backCollar = `assets/jerseys/${jersyNum}/slicings/back-collar.png`;


    // storing all the stripes in the stripeImages array
    const stripeImages = [];
    // we already have base image and the 1 stripe so we started with 2 till the stripeNum which will tell the layers in a uniform
    for (let i = 2; i < stripesNum ; i++) {
      // then push it to an array
      stripeImages.push(
        `assets/jerseys/${jersyNum}/slicings/back-stripes-${i}.png`
      );
    }


    // function for loading the images asynchrounously
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

    // taking the canvas reference and getting context for 2d images
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d", { willReadFrequently: true });

    const drawImages = async () => {
      try {

        // loading all the images and storing it in a varibale
        const [
          defaultShirt,
          defaultShoulder,
          defaultBackStripes,
          backCollarImg,
          shirtbg,
          ...additionalStripes  //this will have all the left stripes images bcz evry jersey have different number of stripes
        ] = await Promise.all([
          loadImages(shirtImage),
          loadImages(selectedShoulderImage),
          loadImages(backStripes),
          loadImages(backCollar),
          loadImages(shirtBg),
           // loading all the images one by one from the stripeImages array
           ...stripeImages.map((src) => loadImages(src)),
        ]);

        context.clearRect(0, 0, canvas.width, canvas.height);

        // default shirt
        context.drawImage(defaultShirt, 10, 30, 300, 600);
        let imageData = context.getImageData(10, 30, 300, 600);
        imageData = changeColor(imageData, shapeColors.shirt1);
        context.putImageData(imageData, 10, 30);

        // background image
        context.drawImage(shirtbg, 10, 30, 300, 600);

        // Draw other default images
        const defaultImages = [
          {
            image: backCollarImg,
            color: shapeColors.neck1,
            position: [10, 30],
          },
          {
            image: defaultShoulder,
            color: shapeColors.shoulder1,
            position: [10, 30],
          },
          {
            image: defaultBackStripes,
            color: shapeColors.shirt2,
            position: [10, 30],
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
            position: [10, 30],
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
      } catch (error) {
        console.error("Error loading images:", error);
      }
    };

    drawImages();
  }, [selectedShoulderImage, shapeColors]);


  // function for changing the color of the jersey in hex format
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

export default JerseyBack;
