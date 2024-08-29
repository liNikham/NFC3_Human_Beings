/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Menu from "./Menu";
import { CgMenuRightAlt } from "react-icons/cg";
import { RxCross2 } from "react-icons/rx";
import navBng from "../../assets/navBg3.png";
import logo from "../../assets/petadopyWhite.png";
import Container from "../shared/Container";
import PatAnime from "../shared/PatAnime";

const NewNab = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollFactor = 1.3;

  const handleScroll = () => {
    const scrollPercentage =
      (window.scrollY /
        (document.documentElement.scrollHeight -
          document.documentElement.clientHeight)) *
      100;
    setScrollPosition(scrollPercentage);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="bg-black shadow-md sticky top-0 left-0 right-0 z-50">
      <Container newClass={"z-50"}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
          <div className="flex-shrink-0 font-bold tracking-wider">
            <img src={logo} className="w-32" alt="Logo" />
          </div>

          <div className="hidden md:block">
            <Menu />
          </div>

          <button
            type="button"
            className="md:hidden p-2 rounded-md text-gray-700"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {!showMobileMenu ? (
              <CgMenuRightAlt className="text-3xl" />
            ) : (
              <RxCross2 className="text-3xl" />
            )}
          </button>
        </div>
        {showMobileMenu && (
          <div className="md:hidden bg-white shadow-md rounded-lg mt-2">
            <Menu />
          </div>
        )}
      </Container>
    </div>



  );
};

export default NewNab;
