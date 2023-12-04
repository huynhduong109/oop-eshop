import React from "react";
import "../../CSS/Hero.css";
import slide1 from "../../../Assests/Image/slide1.jpg";
import slide2 from "../../../Assests/Image/slide2.jpg";
import slide3 from "../../../Assests/Image/slide3.jpg";
import SlideComponent from "../../SlideComponent/SlideComponent";


const Hero = () => {
  return (
    <div>
      <SlideComponent arrImage={[slide1, slide2, slide3]}></SlideComponent>
    </div>
  );
};

export default Hero;
