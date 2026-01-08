import React from 'react';
import { Hero, CountDown, Proposals, Donation } from '../components/HomeSections';

interface HomePageProps {
  setActiveTab: (tab: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ setActiveTab }) => {
  return (
    <>
      <Hero setActiveTab={setActiveTab} />
      <CountDown />
      <Proposals />
      <Donation />
    </>
  );
};

export default HomePage;
