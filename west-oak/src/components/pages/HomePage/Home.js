import React from 'react';
import HeroSection from '../../HeroSection';
import { homeObjOne, homeObjTwo, homeObjThree, homeObjFour } from './Data';

// Main Form.css import. Can be used throughout the application.
import '../../Form.css'

function Home() {

  return (
    <>
      <HeroSection {...homeObjOne} />
    </>
  );
}

export default Home;