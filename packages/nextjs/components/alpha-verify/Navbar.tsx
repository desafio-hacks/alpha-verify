import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Address } from "@/components/scaffold-eth";
import { useAccount } from "wagmi";

import { RainbowKitCustomConnectButton } from '@/components/scaffold-eth';
import { FaucetButton } from '@/components/scaffold-eth';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const navLinks = [
  // { label: 'Home', href: '#' },
  { label: 'About', href: '#' },
  // { label: 'Contact', href: '#' },  
];

const Navbar = () => {

  // const { address: connectedAddress } = useAccount();

  return (
    <div className='container mt-12 flex mx-auto justify-between items-center'>
      <div>

        <Link href={"/home"}>
          <Image src='/assets/Verified-removebg-preview.png' 
            height={50} 
            width={150} 
            alt='logo'
          />
        </Link>
        {/* <Address address={"0x742d35Cc6634C0532925a3b844Bc454e4438f44e"} /> */}

        
      </div>

      <div className="flex">
        {/* <ul className='flex justify-between items-center gap-10 p-4'>
          {navLinks.map(({ label, href }, index) => (
            <li key={index}>
              <Link href={href} className='text-xl'>
                {label}
              </Link>
            </li>
          ))}
        </ul> */}
        <div className="navbar-end flex-grow mr-4">
          {/* <RainbowKitCustomConnectButton /> */}
          <ConnectButton />
          <FaucetButton />
        </div>
      </div>
    </div>
  );
}

export default Navbar;