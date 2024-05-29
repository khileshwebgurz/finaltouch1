import React, { useRef, useEffect } from "react";
import { fabric } from "fabric";
import JerseyCustomisableData from "../../utils/jerseyCustomisableData.js";
const JerseyFront = ({
  selectedNeckImage,
  selectedShoulderImage,
  shapeColors,
  selectedImage,
  imagePosition,
  setImagePosition,
}) => {
  // canvasRef for drawing out base image
  const canvasRef = useRef(null);

  // fabricCanvasRef for drawing our selectedImage bcz fabric describe it's own canvas to draw and image with resising and dragging feature
  const fabricCanvasRef = useRef(null);

  let shirtImage = ``;

  // getting the value of selectedJersey from local storage
  const jersyNum = localStorage.getItem("selectedJersy");

  // conditionally getting the jersey based on narrow or wide
  if (selectedShoulderImage.includes("narrow")) {
    shirtImage = `assets/jerseys/${jersyNum}/slicings/crew_front_narrow_shoulder.png`;
  } else {
    shirtImage = `assets/jerseys/${jersyNum}/slicings/crew_front_wide_shoulder.png`;
  }

  // using bg image of shirt to make it visible
  const shirtBg = `assets/jerseys/${jersyNum}/slicings/crew_front_narrow_shoulderbg.png`;

  // getting all the stripes based on uniform layers
  const stripesNum = JerseyCustomisableData[jersyNum].uniform_layers;

  // intially specifying frontstripe
  const frontStripes = `assets/jerseys/${jersyNum}/slicings/front-stripes.png`;

  // storing all the stripes in the stripeImages array
  const stripeImages = [];
  for (let i = 2; i < stripesNum; i++) {
    stripeImages.push(
      `assets/jerseys/${jersyNum}/slicings/front-stripes-${i}.png`
    );
  }

  // loading all the images before using it
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

  // function for changing the color of the component of the jersey
  const changeColor = (imageData, color) => {
    if (!color) {
      console.error("Color is undefined or null.");
      return imageData;
    }
    const { data } = imageData;
    const hexColor = color.replace(/^#/, "");
    const [r, g, b] = hexColor.match(/.{1,2}/g).map((c) => parseInt(c, 16));
    for (let i = 0; i < data.length; i += 4) {
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
    }
    return imageData;
  };

  const drawImages = async (context) => {
    try {
      const [
        shirt,
        shoulderImg,
        frontStripesImg,
        selectedImg,
        selectedNeckbgImg,
        shirtbg,
        ...additionalStripes //this will have all the left stripes images bcz evry jersey have different number of stripes
      ] = await Promise.all([
        loadImages(shirtImage),
        loadImages(selectedShoulderImage),
        loadImages(frontStripes),
        loadImages(selectedNeckImage.NeckImg),
        loadImages(selectedNeckImage.NeckImgShd),
        loadImages(shirtBg),
        // loading all the images one by one from the stripeImages array
        ...stripeImages.map((src) => loadImages(src)),
      ]);

      var selectedNeckImg2 = "";
      if (
        selectedNeckImage.NeckId === 2 ||
        selectedNeckImage.NeckId === 4 ||
        selectedNeckImage.NeckId === 12
      ) {
        selectedNeckImg2 = await loadImages(selectedNeckImage.NeckClr);
      }

      context.clearRect(0, 0, context.canvas.width, context.canvas.height);

      // Draw shirt
      context.drawImage(shirt, 10, 30, 300, 600);
      let imageData = context.getImageData(10, 30, 300, 600);
      imageData = changeColor(imageData, shapeColors.shirt1);
      context.putImageData(imageData, 10, 30);

      // draw background image  of shirt
      context.drawImage(shirtbg, 10, 30, 300, 600);

      // Draw other images
      const images1 = [
        {
          image: shoulderImg,
          color: shapeColors.shoulder1,
          position: [10, 30],
        },
        {
          image: frontStripesImg,
          color: shapeColors.shirt2,
          position: [10, 30],
        },
      ];

      // now adding all the additional stripes to my Images array so that it can used inside
      // the temporary canvas
      additionalStripes.forEach((stripeImg, index) => {
        // this is for setting color key/button to each image. starting with 3 bcz we already have base image and 1 stripe
        const colorKey = `shirt${index + 3}`;
        // pushing these additional images to the array of temp canvas
        images1.push({
          image: stripeImg,
          color: shapeColors[colorKey],
          position: [10, 30],
        });
      });

      // now putting images in temp canvas and then putting it over original
      images1.forEach(({ image, color, position }) => {
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

      // temp canvas for the neck options bcz neck size should be different from other
      if (selectedNeckImage) {
        const tempCanvasbackStr = document.createElement("canvas");
        tempCanvasbackStr.width = 173;
        tempCanvasbackStr.height = 105;
        const textContextbackStr = tempCanvasbackStr.getContext("2d");
        textContextbackStr.drawImage(selectedImg, -8, -3, 173, 105);
        const tempImagebackStr = textContextbackStr.getImageData(
          -8,
          -3,
          173,
          105
        );
        const updatedTempImagebackStr = changeColor(
          tempImagebackStr,
          shapeColors.neck1
        );
        textContextbackStr.putImageData(updatedTempImagebackStr, -8, -3);
        context.drawImage(tempCanvasbackStr, 80, 30);

        if (
          selectedNeckImage.NeckId === 2 ||
          selectedNeckImage.NeckId === 4 ||
          selectedNeckImage.NeckId === 12
        ) {
          const tempCanvasbackStr = document.createElement("canvas");
          tempCanvasbackStr.width = 300;
          tempCanvasbackStr.height = 600;
          const textContextbackStr = tempCanvasbackStr.getContext("2d");
          textContextbackStr.drawImage(selectedNeckImg2, 4, 14, 300, 600);
          const tempImagebackStr = textContextbackStr.getImageData(
            4,
            14,
            300,
            600
          );
          const updatedTempImagebackStr = changeColor(
            tempImagebackStr,
            shapeColors.neck2
          );
          textContextbackStr.putImageData(updatedTempImagebackStr, 4, 14);
          context.drawImage(tempCanvasbackStr, 4, 14);
        }
      }

      // drawing neck bg image
      context.drawImage(selectedNeckbgImg, 9, 30);
    } catch (error) {
      console.error("Error loading images:", error);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    drawImages(context);
  }, [selectedNeckImage, selectedShoulderImage, shapeColors]);

  useEffect(() => {
    const fabricCanvas = new fabric.Canvas(fabricCanvasRef.current, {
      width: 300,
      height: 600,
    });

    if (selectedImage) {
      // Using fabric.Image.fromURL, the code loads the image specified by selectedImage. Once the image is loaded, the callback function is
      //  executed with the loaded image object img.
      fabric.Image.fromURL(selectedImage, (img) => {
        img.set({
          left: imagePosition.left,
          top: imagePosition.top,
          scaleX: imagePosition.scaleX,
          scaleY: imagePosition.scaleY,
          angle: imagePosition.angle,
          hasRotatingPoint: false,
          lockScalingFlip: true,
          cornerSize: 10,
          transparentCorners: false,
        });

        fabricCanvas.add(img);
        fabricCanvas.setActiveObject(img);

        // when the image is modified then we have to extract left, top, scaleX, scaleY, angle from the img and then set it. Here modiefied is a predefined object of fabric js
        img.on("modified", () => {
          const { left, top, scaleX, scaleY, angle } = img;
          setImagePosition({ left, top, scaleX, scaleY, angle });
        });
      });
    }
    // The dispose method is used to clean up the Fabric.js canvas
    return () => {
      fabricCanvas.dispose();
    };
  }, [selectedImage]);

  return (
    <div style={{ position: "relative", width: 300, height: 600 }}>
      <canvas
        ref={canvasRef}
        width={300}
        height={600}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
        }}
      />
      <canvas
        ref={fabricCanvasRef}
        width={300}
        height={600}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 2,
        }}
      />
    </div>
  );
};

export default JerseyFront;
