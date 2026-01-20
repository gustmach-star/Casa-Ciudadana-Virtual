import React from 'react';
import { Hero, CountDown, DebatesCarousel, Proposals, Donation } from '../components/HomeSections';

interface HomePageProps {
  setActiveTab: (tab: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ setActiveTab }) => {
  return (
    <>
      <Hero setActiveTab={setActiveTab} />
      <CountDown />
      <DebatesCarousel />
      <Proposals />
      <Donation />
    </>
  );
};

export default HomePage;
