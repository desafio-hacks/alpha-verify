'use client'; 

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import Modal from './Modal';
import MintCertificate from './MintCertificate';

const HeroSection = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleGetStartedClick = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <div className="bg-background container mb-28 pt-16 mx-auto flex items-center justify-between">
        <div className="mx-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 space-y-6">
              <h1 className="text-6xl font-extrabold tracking-tight lg:text-7xl text-foreground">
                Secure Your Academic Achievements on the Blockchain
              </h1>
              <p className="text-xl text-muted-foreground">
                Transform your graduate certificates into verifiable NFTs, ensuring the authenticity and permanence of your academic accomplishments.
              </p>
              <div className="flex space-x-4">
                <button
                  className="flex items-center rounded-full border border-white p-5 bg-black"
                  onClick={handleGetStartedClick}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                <button className="flex items-center px-8 rounded-full border-white hover:border border-black p-5 bg-white text-black">
                  Learn more
                </button>
              </div>
            </div>
            <div className="lg:w-1/2">
              <Image
                src="/assets/metaverse.jpg"
                alt="Graduate with blockchain certificate"
                className="relative w-full z-10 rounded-lg shadow-xl"
                width={600}
                height={600}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal Component */}
      <Modal isVisible={isModalVisible} onClose={handleCloseModal}>
        {/* <h1 className='text-black'>skskdkkdkfdkf</h1> */}
        <MintCertificate />
        {/* <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleCloseModal}>
          Close
        </button> */}
      </Modal>
    </div>
  );
};

export default HeroSection;
