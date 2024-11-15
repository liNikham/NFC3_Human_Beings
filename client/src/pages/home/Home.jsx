/* eslint-disable no-unused-vars */
import React from "react";
import { useNavigate } from "react-router-dom";
import Container from "../../components/shared/Container";
import Banner from "./Banner/Banner";
import Category from "./category/Category";
import CalltoAction from "./callToAction/CalltoAction";
import AboutUs from "./AboutUs/AboutUs";
import Review from "./review/Review";
import logo from "../../assets/petadopyWhite.png";
import ReviewSlider from "./reviewSlider/ReviewSlider";

const Home = () => {
  const navigate = useNavigate();

  const handleSeeAllClick = () => {
    navigate("/shelter-registration");
  };

  return (
    <div>
      <Container>
        <div className="relative ">
          <Banner />
        </div>
      </Container>
      <Container>
        <div className="mt-5 rounded-lg flex flex-col w-[100%]  lg:p-10 p-2">
          <Category />
          <div className="flex justify-center items-center lg:m-10 m-2">
            <button
              className="backdrop-blur-xl bg-white/60 text-center lg:w-40 p-2 text-white rounded-md hover:bg-slate-50 font-poppins text-base shadow-md"
              onClick={handleSeeAllClick}
            >
              Register as Shelter
            </button>
          </div>
        </div>
      </Container>
      <Container>
        <div className="lg:mt-20 md:mt-10 mt-5 rounded-lg   relative backdrop-blur-xl bg-white/30">
          <CalltoAction />
        </div>
      </Container>
      <Container>
        <div className="mt-10  relative">
          <AboutUs />
        </div>
      </Container>
      <Container>
        <div className="mt-5 ">
          <ReviewSlider />
        </div>
      </Container>
      <Container>
        <div className="mt-5">
          <Review />
        </div>
      </Container>
    </div>
  );
};

export default Home;
