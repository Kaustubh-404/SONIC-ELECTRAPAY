// import { ethers } from 'ethers';


// export const getContract = (provider: ethers.providers.Provider) => {
//   const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;
//   return new ethers.Contract(contractAddress, PAYROLL_ABI, provider);
// };

// import { providers, Contract } from 'ethers';
//   import { PAYROLL_ABI } from './abi';

// export const getContract = (provider: providers.Provider) => {
//   const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;
//   return new Contract(contractAddress, PAYROLL_ABI, provider);
// };

import { PAYROLL_ABI } from './abi';

export const getContract = () => {
  return {
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    abi: PAYROLL_ABI,
  };
};