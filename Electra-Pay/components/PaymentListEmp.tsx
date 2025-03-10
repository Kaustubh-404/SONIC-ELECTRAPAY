//   "use client";

// import { useState, useEffect } from "react";
// import { useAccount, usePublicClient, useWalletClient } from "wagmi";
// import { getContract } from "@/lib/contract";
// import { formatEther } from "viem";
// import { AlertCircle, Calendar, Clock, DollarSign, User } from 'lucide-react';

// type PaymentDetails = {
//   recipient: string;
//   amount: bigint;
//   period: bigint;
//   endTimestamp: bigint;
//   isActive: boolean;
//   canProcess?: boolean;
// };

// export function PaymentList({ type }: { type: "organization" | "employee" }) {
//   const { address } = useAccount();
//   const publicClient = usePublicClient();
//   const { data: walletClient } = useWalletClient();
//   const [payment, setPayment] = useState<PaymentDetails | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [processing, setProcessing] = useState(false);

//   // Move the data fetching to a useEffect that depends on dependencies that won't 
//   // change during a render cycle
//   useEffect(() => {
//     let isMounted = true;
    
//     const fetchPayment = async () => {
//       if (!publicClient || !address) {
//         if (isMounted) setLoading(false);
//         return;
//       }

//       try {
//         if (isMounted) setError(null);
//         const contract = getContract();

//         // Check if payment ID 0 exists
//         try {
//           const details = (await publicClient.readContract({
//             ...contract,
//             functionName: "recurringPayments",
//             args: [BigInt(0)],
//           })) as [string, bigint, bigint, bigint, boolean];

//           const canProcess = (await publicClient.readContract({
//             ...contract,
//             functionName: "canProcessPayment",
//             args: [BigInt(0)],
//           })) as boolean;

//           if (isMounted) {
//             setPayment({
//               recipient: details[0],
//               amount: details[1],
//               period: details[2],
//               endTimestamp: details[3],
//               isActive: details[4],
//               canProcess,
//             });
//           }
//         } catch (err) {
//           console.error("Failed to fetch payment ID 0:", err);
//           if (isMounted) setError("Payment ID 0 not found or cannot be accessed.");
//         }
//       } catch (err) {
//         console.error("Failed to fetch payment:", err);
//         if (isMounted) setError("Failed to fetch payment details. Please try again.");
//       } finally {
//         if (isMounted) setLoading(false);
//       }
//     };

//     fetchPayment();

//     // Cleanup function to prevent state updates if the component unmounts
//     return () => {
//       isMounted = false;
//     };
//   }, [publicClient, address, type]);

//   const handleProcessPayment = async () => {
//     if (!walletClient || !publicClient) return;

//     try {
//       setProcessing(true);
//       const contract = getContract();

//       const hash = await walletClient.writeContract({
//         ...contract,
//         functionName: "processRecurringPayment",
//         args: [BigInt(0)],
//       });

//       await publicClient.waitForTransactionReceipt({ hash });

//       const canProcess = (await publicClient.readContract({
//         ...contract,
//         functionName: "canProcessPayment",
//         args: [BigInt(0)],
//       })) as boolean;

//       if (payment) {
//         setPayment({
//           ...payment,
//           canProcess,
//         });
//       }
//     } catch (err) {
//       console.error("Failed to process payment:", err);
//       setError("Failed to process payment. Please try again.");
//     } finally {
//       setProcessing(false);
//     }
//   };

//   const formatAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

//   const formatDate = (timestamp: bigint) => {
//     return new Date(Number(timestamp) * 1000).toLocaleDateString();
//   };

//   const formatPeriod = (period: bigint) => {
//     const days = Number(period) / 86400; // Convert seconds to days
//     if (days === 1) return "Daily";
//     if (days === 7) return "Weekly";
//     if (days === 30) return "Monthly";
//     return `Every ${days} days`;
//   };

//   if (!address) {
//     return (
//       <div className="text-center p-6 bg-yellow-500/10 border border-yellow-500/50 text-yellow-700 rounded-lg">
//         Please connect your wallet to view payment details
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="text-center p-6">
//         <div className="animate-pulse text-zinc-400">Loading payment details...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center p-6 bg-red-500/10 border border-red-500/50 text-red-700 rounded-lg flex items-center justify-center space-x-2">
//         <AlertCircle className="h-5 w-5" />
//         <span>{error}</span>
//       </div>
//     );
//   }

//   if (!payment) {
//     return (
//       <div className="text-center p-6 bg-zinc-800/50 border border-zinc-700 rounded-lg text-zinc-400">
//         Payment ID 0 not found
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       <div className="border border-zinc-700 rounded-lg p-6 bg-zinc-800/50 hover:bg-zinc-800/70 transition-colors">
//         <div className="flex justify-between items-start">
//           <div className="space-y-3">
//             <div className="text-sm text-zinc-400">Payment ID #0</div>
//             <div className="flex items-center space-x-2 text-xl font-medium text-white">
//               <DollarSign className="h-5 w-5 text-primary" />
//               <span>{formatEther(payment.amount)} ETH</span>
//             </div>
//             <div className="flex items-center space-x-2 text-sm text-zinc-400">
//               <User className="h-4 w-4" />
//               <span>To: {formatAddress(payment.recipient)}</span>
//             </div>
//             <div className="flex items-center space-x-2 text-sm text-zinc-400">
//               <Clock className="h-4 w-4" />
//               <span>Frequency: {formatPeriod(payment.period)}</span>
//             </div>
//           </div>
//           <div className="text-right space-y-3">
//             {/* <div className="flex items-center space-x-2 text-sm text-zinc-400">
//               <Calendar className="h-4 w-4" />
//               <span>Ends: {formatDate(payment.endTimestamp)}</span>
//             </div> */}
//             <div className="flex flex-col items-end gap-2">
//               <div
//                 className={`text-xs px-2 py-1 rounded-full ${
//                   payment.isActive
//                     ? "bg-green-500/20 text-green-400"
//                     : "bg-zinc-500/20 text-zinc-400"
//                 }`}
//               >
//                 {payment.isActive ? "Active" : "Inactive"}
//               </div>
//               {/* {payment.canProcess && (
//                 <button
//                   onClick={handleProcessPayment}
//                   disabled={processing}
//                   className={`text-xs px-3 py-1 rounded-full 
//                     ${
//                       processing
//                         ? "bg-primary/20 text-primary/60 cursor-not-allowed"
//                         : "bg-primary text-primary-foreground hover:bg-primary/90"
//                     } transition-colors`}
//                 >
//                   {processing ? "Processing..." : "Process Payment"}
//                 </button>
//               )} */}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { getContract } from "@/lib/contract";
import { formatEther } from "viem";
import { AlertCircle, Calendar, Clock, DollarSign, User, Activity, CreditCard, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

type PaymentDetails = {
  recipient: string;
  amount: bigint;
  period: bigint;
  endTimestamp: bigint;
  isActive: boolean;
  canProcess?: boolean;
};

export function PaymentList({ type }: { type: "organization" | "employee" }) {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [payment, setPayment] = useState<PaymentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  // Move the data fetching to a useEffect that depends on dependencies that won't 
  // change during a render cycle
  useEffect(() => {
    let isMounted = true;
    
    const fetchPayment = async () => {
      if (!publicClient || !address) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        if (isMounted) setError(null);
        const contract = getContract();

        // Check if payment ID 0 exists
        try {
          const details = (await publicClient.readContract({
            ...contract,
            functionName: "recurringPayments",
            args: [BigInt(0)],
          })) as [string, bigint, bigint, bigint, boolean];

          const canProcess = (await publicClient.readContract({
            ...contract,
            functionName: "canProcessPayment",
            args: [BigInt(0)],
          })) as boolean;

          if (isMounted) {
            setPayment({
              recipient: details[0],
              amount: details[1],
              period: details[2],
              endTimestamp: details[3],
              isActive: details[4],
              canProcess,
            });
          }
        } catch (err) {
          console.error("Failed to fetch payment ID 0:", err);
          if (isMounted) setError("Payment ID 0 not found or cannot be accessed.");
        }
      } catch (err) {
        console.error("Failed to fetch payment:", err);
        if (isMounted) setError("Failed to fetch payment details. Please try again.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPayment();

    // Cleanup function to prevent state updates if the component unmounts
    return () => {
      isMounted = false;
    };
  }, [publicClient, address, type]);

  const handleProcessPayment = async () => {
    if (!walletClient || !publicClient) return;

    try {
      setProcessing(true);
      const contract = getContract();

      const hash = await walletClient.writeContract({
        ...contract,
        functionName: "processRecurringPayment",
        args: [BigInt(0)],
      });

      await publicClient.waitForTransactionReceipt({ hash });

      const canProcess = (await publicClient.readContract({
        ...contract,
        functionName: "canProcessPayment",
        args: [BigInt(0)],
      })) as boolean;

      if (payment) {
        setPayment({
          ...payment,
          canProcess,
        });
      }
    } catch (err) {
      console.error("Failed to process payment:", err);
      setError("Failed to process payment. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const formatAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleDateString();
  };

  const formatPeriod = (period: bigint) => {
    const days = Number(period) / 86400; // Convert seconds to days
    if (days === 1) return "Daily";
    if (days === 7) return "Weekly";
    if (days === 30) return "Monthly";
    return `Every ${days} days`;
  };

  // Loading and error states with enhanced UI
  if (!address) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center p-6 bg-yellow-500/10 backdrop-blur-sm border border-yellow-500/30 text-yellow-300 rounded-xl shadow-lg flex items-center justify-center gap-3"
      >
        <AlertCircle className="h-5 w-5" />
        <span className="font-medium">Please connect your wallet to view payment details</span>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="p-8 flex flex-col items-center justify-center space-y-4"
      >
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-emerald-300">Loading payment details...</div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center p-6 bg-red-500/10 backdrop-blur-sm border border-red-500/30 text-red-300 rounded-xl shadow-lg flex items-center justify-center gap-3"
      >
        <AlertCircle className="h-5 w-5" />
        <span>{error}</span>
      </motion.div>
    );
  }

  if (!payment) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center p-6 bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/70 rounded-xl shadow-lg text-zinc-400"
      >
        <div className="flex flex-col items-center gap-3">
          <CreditCard className="h-8 w-8 text-zinc-500 mb-2" />
          <p>Payment ID 0 not found</p>
          <p className="text-sm text-zinc-500">No recurring payment has been set up yet.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <motion.div 
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className="border border-zinc-700/70 rounded-xl p-6 bg-zinc-800/40 hover:bg-zinc-800/60 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-emerald-500/5 hover:border-emerald-500/30 group"
      >
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
          {/* Left side - Payment details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-xs text-zinc-500 font-medium">Payment ID</div>
                <div className="text-white font-medium flex items-center gap-2">
                  <span>#0</span>
                  {payment.isActive && (
                    <span className="inline-flex items-center text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse"></span>
                      Active
                    </span>
                  )}
                  {!payment.isActive && (
                    <span className="inline-flex items-center text-xs px-2 py-1 rounded-full bg-zinc-500/20 text-zinc-400">
                      Inactive
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-black/20 p-3 rounded-lg border border-zinc-700/50">
              <div className="flex items-center space-x-2">
                <div className="text-2xl font-bold bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent">
                  {formatEther(payment.amount)} ETH
                </div>
              </div>
              <div className="mt-1 text-xs text-zinc-500">
                Last payment: {new Date(Date.now() - 2592000000).toLocaleDateString()}
              </div>
            </div>
          </div>
          
          {/* Right side - Additional details */}
          <div className="space-y-3 bg-zinc-800/60 rounded-lg p-3 md:min-w-48">
            <div className="flex items-center space-x-3 text-sm text-zinc-300">
              <User className="h-4 w-4 text-emerald-400" />
              <div className="flex flex-col">
                <span className="text-xs text-zinc-500">Recipient</span>
                <span className="font-medium">{formatAddress(payment.recipient)}</span>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-sm text-zinc-300">
              <Clock className="h-4 w-4 text-emerald-400" />
              <div className="flex flex-col">
                <span className="text-xs text-zinc-500">Frequency</span>
                <span className="font-medium">{formatPeriod(payment.period)}</span>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-sm text-zinc-300">
              <Calendar className="h-4 w-4 text-emerald-400" />
              <div className="flex flex-col">
                <span className="text-xs text-zinc-500">Next Payment</span>
                <span className="font-medium">{new Date(Date.now() + 86400000).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex flex-row md:flex-col gap-2 md:self-start">
            <button className="text-xs px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors flex items-center gap-1">
              <Activity className="h-3.5 w-3.5" />
              <span>View History</span>
            </button>
            <button className="text-xs px-3 py-2 rounded-lg border border-zinc-700/50 text-zinc-400 hover:bg-zinc-700/30 transition-colors">
              <MoreHorizontal className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}