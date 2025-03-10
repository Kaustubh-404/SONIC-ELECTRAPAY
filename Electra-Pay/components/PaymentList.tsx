// "use client";

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
//   const [payments, setPayments] = useState<Record<string, PaymentDetails>>({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [processing, setProcessing] = useState<Record<string, boolean>>({});

//   useEffect(() => {
//     const fetchPayments = async () => {
//       if (!publicClient || !address) {
//         setLoading(false);
//         return;
//       }

//       try {
//         setError(null);
//         const contract = getContract();

//         const ids = (await publicClient.readContract({
//           ...contract,
//           functionName: "getActivePaymentIds",
//         })) as bigint[];

//         const paymentDetails: Record<string, PaymentDetails> = {};

//         for (const id of ids) {
//           const details = (await publicClient.readContract({
//             ...contract,
//             functionName: "recurringPayments",
//             args: [id],
//           })) as [string, bigint, bigint, bigint, boolean];

//           const canProcess = (await publicClient.readContract({
//             ...contract,
//             functionName: "canProcessPayment",
//             args: [id],
//           })) as boolean;

//           paymentDetails[id.toString()] = {
//             recipient: details[0],
//             amount: details[1],
//             period: details[2],
//             endTimestamp: details[3],
//             isActive: details[4],
//             canProcess,
//           };
//         }

//         setPayments(paymentDetails);
//       } catch (err) {
//         console.error("Failed to fetch payments:", err);
//         setError("Failed to fetch payment details. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPayments();
//   }, [publicClient, address, type]);

//   const handleProcessPayment = async (id: string) => {
//     if (!walletClient || !publicClient) return;

//     try {
//       setProcessing((prev) => ({ ...prev, [id]: true }));
//       const contract = getContract();

//       const hash = await walletClient.writeContract({
//         ...contract,
//         functionName: "processRecurringPayment",
//         args: [BigInt(id)],
//       });

//       await publicClient.waitForTransactionReceipt({ hash });

//       const canProcess = (await publicClient.readContract({
//         ...contract,
//         functionName: "canProcessPayment",
//         args: [BigInt(id)],
//       })) as boolean;

//       setPayments((prev) => ({
//         ...prev,
//         [id]: {
//           ...prev[id],
//           canProcess,
//         },
//       }));
//     } catch (err) {
//       console.error("Failed to process payment:", err);
//       setError("Failed to process payment. Please try again.");
//     } finally {
//       setProcessing((prev) => ({ ...prev, [id]: false }));
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
//         Please connect your wallet to view payments
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="text-center p-6">
//         <div className="animate-pulse text-zinc-400">Loading payments...</div>
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

//   const paymentIds = Object.keys(payments);

//   if (paymentIds.length === 0) {
//     return (
//       <div className="text-center p-6 bg-zinc-800/50 border border-zinc-700 rounded-lg text-zinc-400">
//         No active payments found
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       {paymentIds.map((id) => {
//         const payment = payments[id];
//         const isProcessing = processing[id];

//         return (
//           <div
//             key={id}
//             className="border border-zinc-700 rounded-lg p-6 bg-zinc-800/50 hover:bg-zinc-800/70 transition-colors"
//           >
//             <div className="flex justify-between items-start">
//               <div className="space-y-3">
//                 <div className="text-sm text-zinc-400">Payment ID #{id}</div>
//                 <div className="flex items-center space-x-2 text-xl font-medium text-white">
//                   <DollarSign className="h-5 w-5 text-primary" />
//                   <span>{formatEther(payment.amount)} ETH</span>
//                 </div>
//                 <div className="flex items-center space-x-2 text-sm text-zinc-400">
//                   <User className="h-4 w-4" />
//                   <span>To: {formatAddress(payment.recipient)}</span>
//                 </div>
//                 <div className="flex items-center space-x-2 text-sm text-zinc-400">
//                   <Clock className="h-4 w-4" />
//                   <span>Frequency: {formatPeriod(payment.period)}</span>
//                 </div>
//               </div>
//               <div className="text-right space-y-3">
//                 <div className="flex items-center space-x-2 text-sm text-zinc-400">
//                   <Calendar className="h-4 w-4" />
//                   <span>Ends: {formatDate(payment.endTimestamp)}</span>
//                 </div>
//                 <div className="flex flex-col items-end gap-2">
//                   <div
//                     className={`text-xs px-2 py-1 rounded-full ${
//                       payment.isActive
//                         ? "bg-green-500/20 text-green-400"
//                         : "bg-zinc-500/20 text-zinc-400"
//                     }`}
//                   >
//                     {payment.isActive ? "Active" : "Inactive"}
//                   </div>
//                   {payment.canProcess && (
//                     <button
//                       onClick={() => handleProcessPayment(id)}
//                       disabled={isProcessing}
//                       className={`text-xs px-3 py-1 rounded-full 
//                         ${
//                           isProcessing
//                             ? "bg-primary/20 text-primary/60 cursor-not-allowed"
//                             : "bg-primary text-primary-foreground hover:bg-primary/90"
//                         } transition-colors`}
//                     >
//                       {isProcessing ? "Processing..." : "Process Payment"}
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }
//=================================================================================================================================this code start here
// "use client";

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
//   lastProcessed?: number; // Timestamp when payment was last processed
// };

// export function PaymentList({ type }: { type: "organization" | "employee" }) {
//   const { address } = useAccount();
//   const publicClient = usePublicClient();
//   const { data: walletClient } = useWalletClient();
//   const [payments, setPayments] = useState<Record<string, PaymentDetails>>({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [processing, setProcessing] = useState<Record<string, boolean>>({});
//   const [now, setNow] = useState<number>(Date.now());

//   // Update the current time every second
//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       setNow(Date.now());
//     }, 1000);
    
//     return () => clearInterval(intervalId);
//   }, []);

//   useEffect(() => {
//     const fetchPayments = async () => {
//       if (!publicClient || !address) {
//         setLoading(false);
//         return;
//       }

//       try {
//         setError(null);
//         const contract = getContract();

//         const ids = (await publicClient.readContract({
//           ...contract,
//           functionName: "getActivePaymentIds",
//         })) as bigint[];

//         const paymentDetails: Record<string, PaymentDetails> = {};

//         for (const id of ids) {
//           const details = (await publicClient.readContract({
//             ...contract,
//             functionName: "recurringPayments",
//             args: [id],
//           })) as [string, bigint, bigint, bigint, boolean];

//           // Always set canProcess to true initially
//           paymentDetails[id.toString()] = {
//             recipient: details[0],
//             amount: details[1],
//             period: details[2],
//             endTimestamp: details[3],
//             isActive: details[4],
//             canProcess: true, // Always allow processing initially
//             lastProcessed: Date.now() // Mark the current time as last processed
//           };
//           console.log(`Payment ID ${id}:`, paymentDetails[id.toString()]);
//         }

//         setPayments(paymentDetails);
//       } catch (err) {
//         console.error("Failed to fetch payments:", err);
//         setError("Failed to fetch payment details. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPayments();
//   }, [publicClient, address, type]);

//   // Determine which payments can be processed based on time elapsed
//   const processablePayments = Object.entries(payments).reduce((acc, [id, payment]) => {
//     // If payment was processed less than 10 seconds ago, it can't be processed again
//     const timeElapsed = now - (payment.lastProcessed || 0);
//     const canProcess = payment.isActive && timeElapsed >= 10000; // 10 seconds
    
//     acc[id] = {
//       ...payment,
//       canProcess
//     };
    
//     return acc;
//   }, {} as Record<string, PaymentDetails>);

//   const handleProcessPayment = async (id: string) => {
//     if (!walletClient || !publicClient) return;

//     try {
//       setProcessing((prev) => ({ ...prev, [id]: true }));
//       const contract = getContract();

//       console.log(`Processing payment ${id}`);
      
//       const hash = await walletClient.writeContract({
//         ...contract,
//         functionName: "processRecurringPayment",
//         args: [BigInt(id)],
//       });

//       console.log(`Transaction submitted with hash: ${hash}`);
      
//       const receipt = await publicClient.waitForTransactionReceipt({ hash });
//       console.log(`Transaction confirmed: ${receipt.status}`);

//       // Update the payment's lastProcessed timestamp
//       setPayments(prevPayments => {
//         const updatedPayment = {
//           ...prevPayments[id],
//           lastProcessed: Date.now()
//         };
        
//         return {
//           ...prevPayments,
//           [id]: updatedPayment
//         };
//       });
//     } catch (err) {
//       console.error("Failed to process payment:", err);
//       setError("Failed to process payment. Please try again.");
//     } finally {
//       setProcessing((prev) => ({ ...prev, [id]: false }));
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
//         Please connect your wallet to view payments
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="text-center p-6">
//         <div className="animate-pulse text-zinc-400">Loading payments...</div>
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

//   const paymentIds = Object.keys(payments);

//   if (paymentIds.length === 0) {
//     return (
//       <div className="text-center p-6 bg-zinc-800/50 border border-zinc-700 rounded-lg text-zinc-400">
//         No active payments found
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       {paymentIds.map((id) => {
//         const payment = processablePayments[id];
//         const isProcessing = processing[id];
//         const timeElapsed = now - (payment.lastProcessed || 0);
//         const timeRemaining = Math.max(0, 10 - Math.floor(timeElapsed / 1000));

//         return (
//           <div
//             key={id}
//             className="border border-zinc-700 rounded-lg p-6 bg-zinc-800/50 hover:bg-zinc-800/70 transition-colors"
//           >
//             <div className="flex justify-between items-start">
//               <div className="space-y-3">
//                 <div className="text-sm text-zinc-400">Payment ID #{id}</div>
//                 <div className="flex items-center space-x-2 text-xl font-medium text-white">
//                   <DollarSign className="h-5 w-5 text-primary" />
//                   <span>{formatEther(payment.amount)} ETH</span>
//                 </div>
//                 <div className="flex items-center space-x-2 text-sm text-zinc-400">
//                   <User className="h-4 w-4" />
//                   <span>To: {formatAddress(payment.recipient)}</span>
//                 </div>
//                 <div className="flex items-center space-x-2 text-sm text-zinc-400">
//                   <Clock className="h-4 w-4" />
//                   <span>Frequency: {formatPeriod(payment.period)}</span>
//                 </div>
//               </div>
//               <div className="text-right space-y-3">
//                 <div className="flex items-center space-x-2 text-sm text-zinc-400">
//                   <Calendar className="h-4 w-4" />
//                   <span>Ends: {formatDate(payment.endTimestamp)}</span>
//                 </div>
//                 <div className="flex flex-col items-end gap-2">
//                   <div
//                     className={`text-xs px-2 py-1 rounded-full ${
//                       payment.isActive
//                         ? "bg-green-500/20 text-green-400"
//                         : "bg-zinc-500/20 text-zinc-400"
//                     }`}
//                   >
//                     {payment.isActive ? "Active" : "Inactive"}
//                   </div>
                  
//                   {!payment.canProcess && (
//                     <div className="text-xs px-3 py-1 rounded-full bg-zinc-700 text-zinc-300">
//                       Available in {timeRemaining}s
//                     </div>
//                   )}
                  
//                   {payment.canProcess && (
//                     <button
//                       onClick={() => handleProcessPayment(id)}
//                       disabled={isProcessing}
//                       className={`text-xs px-3 py-1 rounded-full 
//                         ${
//                           isProcessing
//                             ? "bg-primary/20 text-primary/60 cursor-not-allowed"
//                             : "bg-primary text-primary-foreground hover:bg-primary/90"
//                         } transition-colors`}
//                     >
//                       {isProcessing ? "Processing..." : "Process Payment"}
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

//=====================================End here
//==============================================starthere

// "use client";

// import { useState, useEffect } from "react";
// import { useAccount, usePublicClient, useWalletClient } from "wagmi";
// import { getContract } from "@/lib/contract";
// import { formatEther, parseEther } from "viem";
// import { AlertCircle, Calendar, Clock, DollarSign, User, RefreshCw, Wallet, Plus } from 'lucide-react';

// type PaymentDetails = {
//   recipient: string;
//   amount: bigint;
//   interval: bigint;
//   lastPayment: bigint;
//   isActive: boolean;
//   canProcess: boolean;
//   nextPaymentTime: number;
//   reasonNotProcessable?: string;
// };

// export function PaymentList({ type }: { type: "organization" | "employee" }) {
//   const { address } = useAccount();
//   const publicClient = usePublicClient();
//   const { data: walletClient } = useWalletClient();
//   const [payments, setPayments] = useState<Record<string, PaymentDetails>>({});
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [processing, setProcessing] = useState<Record<string, boolean>>({});
//   const [now, setNow] = useState<number>(Math.floor(Date.now() / 1000)); // Current time in seconds
//   const [lastRefresh, setLastRefresh] = useState<number>(Date.now());
  
//   // Contract balance functionality
//   const [contractBalance, setContractBalance] = useState<bigint>(BigInt(0));
//   const [showDepositForm, setShowDepositForm] = useState(false);
//   const [depositAmount, setDepositAmount] = useState<string>("0.1");
//   const [depositLoading, setDepositLoading] = useState(false);
//   const [depositSuccess, setDepositSuccess] = useState(false);

//   // Update the current time every second
//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       setNow(Math.floor(Date.now() / 1000));
//     }, 1000);
    
//     return () => clearInterval(intervalId);
//   }, []);

//   // Fetch contract balance
//   const fetchContractBalance = async () => {
//     if (!publicClient) return BigInt(0);
    
//     try {
//       const contract = getContract();
//       const balance = await publicClient.readContract({
//         ...contract,
//         functionName: "getContractBalance",
//       }) as bigint;
      
//       setContractBalance(balance);
//       return balance;
//     } catch (err) {
//       console.error("Failed to fetch contract balance:", err);
//       return BigInt(0);
//     }
//   };

//   // Fetch payments data
//   const fetchPayments = async (showRefreshing = true) => {
//     if (!publicClient || !address) {
//       setLoading(false);
//       return;
//     }

//     try {
//       if (showRefreshing) {
//         setRefreshing(true);
//       }
//       setError(null);
//       const contract = getContract();

//       // First, get contract balance
//       const balance = await fetchContractBalance();
//       console.log(`Contract balance: ${formatEther(balance)} ETH`);

//       // Get active payment IDs
//       const ids = (await publicClient.readContract({
//         ...contract,
//         functionName: "getActivePaymentIds",
//       })) as bigint[];

//       const paymentDetails: Record<string, PaymentDetails> = {};

//       // Fetch details for each payment
//       for (const id of ids) {
//         try {
//           // Get payment struct data
//           const details = (await publicClient.readContract({
//             ...contract,
//             functionName: "recurringPayments",
//             args: [id],
//           })) as [string, bigint, bigint, bigint, boolean];

//           // Check if the payment can be processed
//           const canProcess = await publicClient.readContract({
//             ...contract,
//             functionName: "canProcessPayment",
//             args: [id],
//           }) as boolean;

//           const nextPaymentTime = Number(details[3]) + Number(details[2]);
          
//           // Determine why a payment can't be processed
//           let reasonNotProcessable = "";
//           if (!details[4]) {
//             reasonNotProcessable = "Payment inactive";
//           } else if (now < nextPaymentTime) {
//             reasonNotProcessable = "Not due yet";
//           } else if (details[1] > (contractBalance || BigInt(0))) {
//             reasonNotProcessable = "Insufficient contract balance";
//           } else if (!canProcess) {
//             reasonNotProcessable = "Unknown reason";
//           }

//           paymentDetails[id.toString()] = {
//             recipient: details[0],
//             amount: details[1],
//             interval: details[2],
//             lastPayment: details[3],
//             isActive: details[4],
//             canProcess: canProcess,
//             nextPaymentTime: nextPaymentTime,
//             reasonNotProcessable: reasonNotProcessable
//           };
          
//           console.log(`Payment #${id}: ${formatEther(details[1])} ETH, processable: ${canProcess}, reason: ${reasonNotProcessable || 'N/A'}`);
//         } catch (err) {
//           console.error(`Error fetching details for payment ${id}:`, err);
//         }
//       }

//       setPayments(paymentDetails);
//       setLastRefresh(Date.now());
//     } catch (err) {
//       console.error("Failed to fetch payments:", err);
//       setError("Failed to fetch payment details. Please try again.");
//     } finally {
//       setLoading(false);
//       if (showRefreshing) {
//         setRefreshing(false);
//       }
//     }
//   };

//   // Deposit funds to contract
//   const handleDeposit = async () => {
//     if (!address || !walletClient || !publicClient) return;
    
//     try {
//       setDepositLoading(true);
//       setError(null);
//       setDepositSuccess(false);
      
//       const etherAmount = parseEther(depositAmount);
//       const contract = getContract();
      
//       // Use depositFunds function to add ETNto contract
//       const hash = await walletClient.writeContract({
//         ...contract,
//         functionName: "depositFunds",
//         value: etherAmount,
//       });
      
//       console.log(`Deposit transaction submitted: ${hash}`);
      
//       // Wait for transaction to be confirmed
//       const receipt = await publicClient.waitForTransactionReceipt({ hash });
//       console.log(`Deposit confirmed: ${receipt.status}`);
      
//       // Refresh balance and payments after successful deposit
//       await fetchContractBalance();
//       await fetchPayments(false);
//       setDepositSuccess(true);
      
//       // Hide the deposit form after success
//       setTimeout(() => {
//         setShowDepositForm(false);
//         setDepositSuccess(false);
//       }, 3000);
//     } catch (err) {
//       console.error("Deposit failed:", err);
//       setError(`Deposit failed: ${(err as Error).message}`);
//     } finally {
//       setDepositLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPayments(false);
    
//     // Set up polling to refresh payment data regularly
//     const pollInterval = setInterval(() => {
//       fetchPayments(false);
//     }, 30000); // Refresh every 30 seconds
    
//     return () => clearInterval(pollInterval);
//   }, [publicClient, address, type]);

//   const handleProcessPayment = async (id: string) => {
//     if (!walletClient || !publicClient) return;

//     try {
//       setProcessing((prev) => ({ ...prev, [id]: true }));
//       const contract = getContract();

//       console.log(`Processing payment ${id}`);
      
//       // Estimate gas first to check if transaction will succeed
//       try {
//         const gasEstimate = await publicClient.estimateContractGas({
//           ...contract,
//           functionName: "processRecurringPayment",
//           args: [BigInt(id)],
//           account: address as `0x${string}`,
//         });
        
//         console.log(`Estimated gas: ${gasEstimate}`);
        
//         // Include a 20% buffer on the gas estimate
//         const gasLimit = (gasEstimate * BigInt(120)) / BigInt(100);
        
//         const hash = await walletClient.writeContract({
//           ...contract,
//           functionName: "processRecurringPayment",
//           args: [BigInt(id)],
//           gas: gasLimit,
//         });

//         console.log(`Transaction submitted with hash: ${hash}`);
        
//         const receipt = await publicClient.waitForTransactionReceipt({ hash });
//         console.log(`Transaction confirmed: ${receipt.status}`);
        
//         // Refresh payment data to get updated status
//         await fetchPayments(false);
        
//       } catch (gasError) {
//         console.error("Gas estimation failed:", gasError);
        
//         // If gas estimation fails, try with a manual gas limit
//         console.log("Trying with manual gas limit");
//         const hash = await walletClient.writeContract({
//           ...contract,
//           functionName: "processRecurringPayment",
//           args: [BigInt(id)],
//           gas: BigInt(300000), // Manual gas limit
//         });
        
//         console.log(`Transaction submitted with hash: ${hash}`);
        
//         const receipt = await publicClient.waitForTransactionReceipt({ hash });
//         console.log(`Transaction confirmed: ${receipt.status}`);
        
//         // Refresh payment data after processing
//         await fetchPayments(false);
//       }
      
//     } catch (err) {
//       console.error("Failed to process payment:", err);
//       setError("Failed to process payment. The payment may not be due yet or there might be insufficient balance.");
//     } finally {
//       setProcessing((prev) => ({ ...prev, [id]: false }));
//     }
//   };

//   const handleRefresh = () => {
//     fetchPayments(true);
//   };

//   const formatAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

//   const formatPeriod = (period: bigint) => {
//     const seconds = Number(period);
//     if (seconds === 60) return "Every minute";
//     if (seconds === 300) return "Every 5 minutes";
//     if (seconds === 3600) return "Hourly";
//     if (seconds === 86400) return "Daily";
//     if (seconds === 604800) return "Weekly";
//     if (seconds === 2592000) return "Monthly";
    
//     // For custom periods
//     if (seconds < 60) return `Every ${seconds} seconds`;
//     if (seconds < 3600) return `Every ${Math.floor(seconds / 60)} minutes`;
//     if (seconds < 86400) return `Every ${Math.floor(seconds / 3600)} hours`;
//     return `Every ${Math.floor(seconds / 86400)} days`;
//   };

//   const formatTimeUntil = (timestamp: number) => {
//     const timeUntilNext = timestamp - now;
    
//     if (timeUntilNext <= 0) return "Ready";
    
//     const days = Math.floor(timeUntilNext / 86400);
//     const hours = Math.floor((timeUntilNext % 86400) / 3600);
//     const minutes = Math.floor((timeUntilNext % 3600) / 60);
//     const seconds = Math.floor(timeUntilNext % 60);
    
//     if (days > 0) return `${days}d ${hours}h`;
//     if (hours > 0) return `${hours}h ${minutes}m`;
//     if (minutes > 0) return `${minutes}m ${seconds}s`;
//     return `${seconds}s`;
//   };

//   if (!address) {
//     return (
//       <div className="text-center p-6 bg-yellow-500/10 border border-yellow-500/50 text-yellow-700 rounded-lg">
//         Please connect your wallet to view payments
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="text-center p-6">
//         <div className="animate-pulse text-zinc-400">Loading payments...</div>
//       </div>
//     );
//   }

//   const paymentIds = Object.keys(payments);
//   const insufficientBalance = Object.values(payments).some(
//     p => p.reasonNotProcessable === "Insufficient contract balance"
//   );

//   return (
//     <div className="space-y-4">
//       {/* Contract Balance Section */}
//       <div className="border border-zinc-700 rounded-lg p-4 bg-zinc-800/50 mb-6">
//         <div className="flex justify-between items-center">
//           <div className="flex items-center space-x-2">
//             <Wallet className="h-5 w-5 text-zinc-400" />
//             <span className="text-sm text-zinc-400">Contract Balance:</span>
//             <span className="font-medium text-white">{formatEther(contractBalance || BigInt(0))} ETH</span>
//           </div>
          
//           <button
//             onClick={() => setShowDepositForm(!showDepositForm)}
//             className="text-sm flex items-center space-x-1 text-primary hover:text-primary/80"
//           >
//             {showDepositForm ? (
//               <span>Hide Form</span>
//             ) : (
//               <>
//                 <Plus className="h-4 w-4" />
//                 <span>Add Funds</span>
//               </>
//             )}
//           </button>
//         </div>
        
//         {insufficientBalance && !showDepositForm && (
//           <div className="mt-2 bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 p-2 rounded-lg text-xs">
//             ETN to the Mars!
//           </div>
//         )}
        
//         {showDepositForm && (
//           <div className="mt-4 border-t border-zinc-700 pt-4">
//             {depositSuccess && (
//               <div className="mb-4 bg-green-500/10 border border-green-500/50 text-green-700 p-2 rounded-lg text-sm flex items-center space-x-2">
//                 <span>✓</span>
//                 <span>Deposit successful!</span>
//               </div>
//             )}
            
//             <div className="flex space-x-2">
//               <div className="relative flex-grow">
//                 <input
//                   type="number"
//                   value={depositAmount}
//                   onChange={(e) => setDepositAmount(e.target.value)}
//                   step="0.01"
//                   min="0.01"
//                   className="w-full px-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent pl-10"
//                   placeholder="0.0"
//                 />
//                 <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 h-5 w-5" />
//               </div>
              
//               <button
//                 onClick={handleDeposit}
//                 disabled={depositLoading || !walletClient || depositAmount === "0"}
//                 className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {depositLoading ? "Processing..." : "Deposit"}
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
      
//       {/* Payment List */}
//       <div className="flex justify-between items-center">
//         <h2 className="text-xl font-semibold text-white">
//           Active Payments ({paymentIds.length})
//         </h2>
//         <button 
//           onClick={handleRefresh}
//           disabled={refreshing}
//           className="flex items-center space-x-1 text-sm text-primary hover:text-primary/80 disabled:opacity-50"
//         >
//           <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
//           <span>Refresh</span>
//         </button>
//       </div>
      
//       {error && (
//         <div className="text-center p-4 bg-red-500/10 border border-red-500/50 text-red-700 rounded-lg flex items-center justify-center space-x-2">
//           <AlertCircle className="h-5 w-5" />
//           <span>{error}</span>
//         </div>
//       )}
      
//       {paymentIds.length === 0 ? (
//         <div className="text-center p-6 bg-zinc-800/50 border border-zinc-700 rounded-lg text-zinc-400">
//           No active payments found
//         </div>
//       ) : (
//         <div className="space-y-4">
//           <div className="text-xs text-zinc-500 text-right">
//             Last updated: {new Date(lastRefresh).toLocaleTimeString()}
//           </div>
          
//           {paymentIds.map((id) => {
//             const payment = payments[id];
//             const isProcessing = processing[id];
//             const nextTime = formatTimeUntil(payment.nextPaymentTime);

//             return (
//               <div
//                 key={id}
//                 className="border border-zinc-700 rounded-lg p-6 bg-zinc-800/50 hover:bg-zinc-800/70 transition-colors"
//               >
//                 <div className="flex justify-between items-start">
//                   <div className="space-y-3">
//                     <div className="text-sm text-zinc-400">Payment ID #{id}</div>
//                     <div className="flex items-center space-x-2 text-xl font-medium text-white">
//                       <DollarSign className="h-5 w-5 text-primary" />
//                       <span>{formatEther(payment.amount)} ETH</span>
//                     </div>
//                     <div className="flex items-center space-x-2 text-sm text-zinc-400">
//                       <User className="h-4 w-4" />
//                       <span>To: {formatAddress(payment.recipient)}</span>
//                     </div>
//                     <div className="flex items-center space-x-2 text-sm text-zinc-400">
//                       <Clock className="h-4 w-4" />
//                       <span>Frequency: {formatPeriod(payment.interval)}</span>
//                     </div>
//                   </div>
//                   <div className="text-right space-y-3">
//                     <div className="flex items-center space-x-2 text-sm text-zinc-400">
//                       <Calendar className="h-4 w-4" />
//                       <span>
//                         Next payment: {nextTime === "Ready" ? (
//                           payment.canProcess ? (
//                             <span className="text-green-400">Ready now</span>
//                           ) : (
//                             <span className="text-yellow-400">Time elapsed, checking...</span>
//                           )
//                         ) : (
//                           <span>in {nextTime}</span>
//                         )}
//                       </span>
//                     </div>
//                     <div className="flex flex-col items-end gap-2">
//                       <div
//                         className={`text-xs px-2 py-1 rounded-full ${
//                           payment.isActive
//                             ? "bg-green-500/20 text-green-400"
//                             : "bg-zinc-500/20 text-zinc-400"
//                         }`}
//                       >
//                         {payment.isActive ? "Active" : "Inactive"}
//                       </div>
                      
//                       {nextTime === "Ready" ? (
//                         payment.canProcess ? (
//                           <button
//                             onClick={() => handleProcessPayment(id)}
//                             disabled={isProcessing}
//                             className={`text-xs px-3 py-1 rounded-full 
//                               ${
//                                 isProcessing
//                                   ? "bg-primary/20 text-primary/60 cursor-not-allowed"
//                                   : "bg-primary text-primary-foreground hover:bg-primary/90"
//                               } transition-colors`}
//                           >
//                             {isProcessing ? "Processing..." : "Process Payment"}
//                           </button>
//                         ) : (
//                           <div className="text-xs px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400">
//                             {payment.reasonNotProcessable || "Time ready but contract not ready"}
//                           </div>
//                         )
//                       ) : (
//                         <div className="text-xs px-3 py-1 rounded-full bg-zinc-700 text-zinc-300">
//                           Wait {nextTime}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }
//===============end


"use client";

import { useState, useEffect } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { getContract } from "@/lib/contract";
import { formatEther, parseEther } from "viem";
import { 
  AlertCircle, Calendar, Clock, DollarSign, User, RefreshCw, 
  Wallet, Plus, CheckCircle2, ArrowDownCircle, InfoIcon, 
  ActivityIcon, Shield, AlertTriangle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type PaymentDetails = {
  recipient: string;
  amount: bigint;
  interval: bigint;
  lastPayment: bigint;
  isActive: boolean;
  canProcess: boolean;
  nextPaymentTime: number;
  reasonNotProcessable?: string;
};

export function PaymentList({ type }: { type: "organization" | "employee" }) {
  // Fix hydration error by tracking component mounting
  const [mounted, setMounted] = useState(false);
  
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [payments, setPayments] = useState<Record<string, PaymentDetails>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<Record<string, boolean>>({});
  const [now, setNow] = useState<number>(Math.floor(Date.now() / 1000)); // Current time in seconds
  const [lastRefresh, setLastRefresh] = useState<number>(Date.now());
  
  // Contract balance functionality
  const [contractBalance, setContractBalance] = useState<bigint>(BigInt(0));
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [depositAmount, setDepositAmount] = useState<string>("0.1");
  const [depositLoading, setDepositLoading] = useState(false);
  const [depositSuccess, setDepositSuccess] = useState(false);

  // Set mounted state on initial client-side render
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Update the current time every second
  useEffect(() => {
    if (!mounted) return; // Skip if not mounted yet
    
    const intervalId = setInterval(() => {
      setNow(Math.floor(Date.now() / 1000));
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [mounted]);

  // Fetch contract balance
  const fetchContractBalance = async () => {
    if (!publicClient || !mounted) return BigInt(0);
    
    try {
      const contract = getContract();
      const balance = await publicClient.readContract({
        ...contract,
        functionName: "getContractBalance",
      }) as bigint;
      
      if (mounted) {
        setContractBalance(balance);
      }
      return balance;
    } catch (err) {
      console.error("Failed to fetch contract balance:", err);
      return BigInt(0);
    }
  };

  // Fetch payments data
  const fetchPayments = async (showRefreshing = true) => {
    if (!publicClient || !address || !mounted) {
      if (mounted) {
        setLoading(false);
      }
      return;
    }

    try {
      if (showRefreshing && mounted) {
        setRefreshing(true);
      }
      if (mounted) {
        setError(null);
      }
      const contract = getContract();

      // First, get contract balance
      const balance = await fetchContractBalance();
      console.log(`Contract balance: ${formatEther(balance)} ETH`);

      // Get active payment IDs
      const ids = (await publicClient.readContract({
        ...contract,
        functionName: "getActivePaymentIds",
      })) as bigint[];

      const paymentDetails: Record<string, PaymentDetails> = {};

      // Fetch details for each payment
      for (const id of ids) {
        try {
          // Get payment struct data
          const details = (await publicClient.readContract({
            ...contract,
            functionName: "recurringPayments",
            args: [id],
          })) as [string, bigint, bigint, bigint, boolean];

          // Check if the payment can be processed
          const canProcess = await publicClient.readContract({
            ...contract,
            functionName: "canProcessPayment",
            args: [id],
          }) as boolean;

          const nextPaymentTime = Number(details[3]) + Number(details[2]);
          
          // Determine why a payment can't be processed
          let reasonNotProcessable = "";
          if (!details[4]) {
            reasonNotProcessable = "Payment inactive";
          } else if (now < nextPaymentTime) {
            reasonNotProcessable = "Not due yet";
          } else if (details[1] > (contractBalance || BigInt(0))) {
            reasonNotProcessable = "Insufficient contract balance";
          } else if (!canProcess) {
            reasonNotProcessable = "Unknown reason";
          }

          paymentDetails[id.toString()] = {
            recipient: details[0],
            amount: details[1],
            interval: details[2],
            lastPayment: details[3],
            isActive: details[4],
            canProcess: canProcess,
            nextPaymentTime: nextPaymentTime,
            reasonNotProcessable: reasonNotProcessable
          };
          
          console.log(`Payment #${id}: ${formatEther(details[1])} ETH, processable: ${canProcess}, reason: ${reasonNotProcessable || 'N/A'}`);
        } catch (err) {
          console.error(`Error fetching details for payment ${id}:`, err);
        }
      }

      if (mounted) {
        setPayments(paymentDetails);
        setLastRefresh(Date.now());
      }
    } catch (err) {
      console.error("Failed to fetch payments:", err);
      if (mounted) {
        setError("Failed to fetch payment details. Please try again.");
      }
    } finally {
      if (mounted) {
        setLoading(false);
        if (showRefreshing) {
          setRefreshing(false);
        }
      }
    }
  };

  // Deposit funds to contract
  const handleDeposit = async () => {
    if (!address || !walletClient || !publicClient) return;
    
    try {
      setDepositLoading(true);
      setError(null);
      setDepositSuccess(false);
      
      const etherAmount = parseEther(depositAmount);
      const contract = getContract();
      
      // Use depositFunds function to add ETNto contract
      const hash = await walletClient.writeContract({
        ...contract,
        functionName: "depositFunds",
        value: etherAmount,
      });
      
      console.log(`Deposit transaction submitted: ${hash}`);
      
      // Wait for transaction to be confirmed
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      console.log(`Deposit confirmed: ${receipt.status}`);
      
      // Refresh balance and payments after successful deposit
      await fetchContractBalance();
      await fetchPayments(false);
      setDepositSuccess(true);
      
      // Hide the deposit form after success
      setTimeout(() => {
        setShowDepositForm(false);
        setDepositSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Deposit failed:", err);
      setError(`Deposit failed: ${(err as Error).message}`);
    } finally {
      setDepositLoading(false);
    }
  };

  // Move data fetching to useEffect hook with mounted check
  useEffect(() => {
    if (!mounted) return; // Prevent data fetching during hydration
    
    fetchPayments(false);
    
    // Set up polling to refresh payment data regularly
    const pollInterval = setInterval(() => {
      fetchPayments(false);
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(pollInterval);
  }, [publicClient, address, type, mounted]);

  const handleProcessPayment = async (id: string) => {
    if (!walletClient || !publicClient) return;

    try {
      setProcessing((prev) => ({ ...prev, [id]: true }));
      const contract = getContract();

      console.log(`Processing payment ${id}`);
      
      // Estimate gas first to check if transaction will succeed
      try {
        const gasEstimate = await publicClient.estimateContractGas({
          ...contract,
          functionName: "processRecurringPayment",
          args: [BigInt(id)],
          account: address as `0x${string}`,
        });
        
        console.log(`Estimated gas: ${gasEstimate}`);
        
        // Include a 20% buffer on the gas estimate
        const gasLimit = (gasEstimate * BigInt(120)) / BigInt(100);
        
        const hash = await walletClient.writeContract({
          ...contract,
          functionName: "processRecurringPayment",
          args: [BigInt(id)],
          gas: gasLimit,
        });

        console.log(`Transaction submitted with hash: ${hash}`);
        
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        console.log(`Transaction confirmed: ${receipt.status}`);
        
        // Refresh payment data to get updated status
        await fetchPayments(false);
        
      } catch (gasError) {
        console.error("Gas estimation failed:", gasError);
        
        // If gas estimation fails, try with a manual gas limit
        console.log("Trying with manual gas limit");
        const hash = await walletClient.writeContract({
          ...contract,
          functionName: "processRecurringPayment",
          args: [BigInt(id)],
          gas: BigInt(300000), // Manual gas limit
        });
        
        console.log(`Transaction submitted with hash: ${hash}`);
        
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        console.log(`Transaction confirmed: ${receipt.status}`);
        
        // Refresh payment data after processing
        await fetchPayments(false);
      }
      
    } catch (err) {
      console.error("Failed to process payment:", err);
      setError("Failed to process payment. The payment may not be due yet or there might be insufficient balance.");
    } finally {
      setProcessing((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleRefresh = () => {
    fetchPayments(true);
  };

  const formatAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

  const formatPeriod = (period: bigint) => {
    const seconds = Number(period);
    if (seconds === 60) return "Every minute";
    if (seconds === 300) return "Every 5 minutes";
    if (seconds === 3600) return "Hourly";
    if (seconds === 86400) return "Daily";
    if (seconds === 604800) return "Weekly";
    if (seconds === 2592000) return "Monthly";
    
    // For custom periods
    if (seconds < 60) return `Every ${seconds} seconds`;
    if (seconds < 3600) return `Every ${Math.floor(seconds / 60)} minutes`;
    if (seconds < 86400) return `Every ${Math.floor(seconds / 3600)} hours`;
    return `Every ${Math.floor(seconds / 86400)} days`;
  };

  const formatTimeUntil = (timestamp: number) => {
    const timeUntilNext = timestamp - now;
    
    if (timeUntilNext <= 0) return "Ready";
    
    const days = Math.floor(timeUntilNext / 86400);
    const hours = Math.floor((timeUntilNext % 86400) / 3600);
    const minutes = Math.floor((timeUntilNext % 3600) / 60);
    const seconds = Math.floor(timeUntilNext % 60);
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  // Return early during hydration
  if (!mounted) {
    return null;
  }

  if (!address) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center p-6 bg-yellow-500/10 backdrop-blur-sm border border-yellow-500/30 text-yellow-300 rounded-xl shadow-lg flex items-center justify-center gap-3"
      >
        <AlertCircle className="h-5 w-5" />
        <span className="font-medium">Please connect your wallet to view payments</span>
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
        <div className="text-emerald-300">Loading payments...</div>
      </motion.div>
    );
  }

  const paymentIds = Object.keys(payments);
  const insufficientBalance = Object.values(payments).some(
    p => p.reasonNotProcessable === "Insufficient contract balance"
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Contract Balance Section */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="border border-zinc-700/70 rounded-xl p-5 bg-zinc-800/40 backdrop-blur-sm shadow-lg hover:shadow-emerald-500/5 hover:bg-zinc-800/50 transition-all duration-300"
      >
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Wallet className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-sm text-zinc-400">Contract Balance</div>
              <div className="text-xl font-bold bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent">
                {formatEther(contractBalance || BigInt(0))} ETH
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setShowDepositForm(!showDepositForm)}
            className="text-sm flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors px-4 py-2 rounded-lg hover:bg-emerald-500/10 border border-emerald-500/30"
          >
            {showDepositForm ? (
              <span>Hide Form</span>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                <span>Add Funds</span>
              </>
            )}
          </button>
        </div>
        
        {insufficientBalance && !showDepositForm && (
          <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 p-3 rounded-lg text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span>STO THE MOON!</span>
          </div>
        )}
        
        <AnimatePresence>
          {showDepositForm && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 border-t border-zinc-700/50 pt-4 overflow-hidden"
            >
              {depositSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-lg text-sm flex items-center gap-2"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Deposit successful!</span>
                </motion.div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-grow">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500 h-5 w-5" />
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    step="0.01"
                    min="0.01"
                    className="w-full px-4 py-3 bg-zinc-800/60 border border-zinc-700/70 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all pl-10 placeholder:text-zinc-500 text-white"
                    placeholder="Amount to deposit"
                  />
                </div>
                
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 1 }}
                  onClick={handleDeposit}
                  disabled={depositLoading || !walletClient || depositAmount === "0"}
                  className={`px-4 py-3 rounded-xl font-medium text-black focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto
                  ${depositLoading ? 'bg-emerald-500/70' : 'bg-emerald-500 hover:bg-emerald-400'} 
                  transition-all duration-200 flex items-center justify-center gap-2`}
                >
                  {depositLoading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Wallet className="h-4 w-4" />
                      <span>Deposit</span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Payment List Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mt-6">
        <h2 className="text-xl font-bold bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent flex items-center gap-2">
          <ActivityIcon className="h-5 w-5 text-emerald-400" />
          Active Payments
          <span className="text-sm py-0.5 px-2 bg-emerald-500/20 text-emerald-400 rounded-full">
            {paymentIds.length}
          </span>
        </h2>
        <motion.button 
          onClick={handleRefresh}
          disabled={refreshing}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 disabled:opacity-50 px-3 py-1.5 rounded-lg hover:bg-emerald-500/10 border border-emerald-500/30"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
        </motion.button>
      </div>
      
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-center p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl backdrop-blur-sm flex items-center justify-center gap-3"
          >
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Last Updated Time */}
      <div className="flex justify-end items-center gap-2 text-xs text-zinc-500">
        <Clock className="h-3 w-3" />
        Last updated: {new Date(lastRefresh).toLocaleTimeString()}
      </div>
      
      {/* Payment List */}
      {paymentIds.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center p-8 bg-zinc-800/40 border border-zinc-700/70 rounded-xl backdrop-blur-sm text-zinc-400 flex flex-col items-center gap-3"
        >
          <ActivityIcon className="h-10 w-10 text-zinc-500 mb-2" />
          <p>No active payments found</p>
          <p className="text-sm text-zinc-500">Payments will appear here once created</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {paymentIds.map((id, index) => {
            const payment = payments[id];
            const isProcessing = processing[id];
            const nextTime = formatTimeUntil(payment.nextPaymentTime);
            const isReadyToProcess = nextTime === "Ready" && payment.canProcess;

            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
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
                          <span>#{id}</span>
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
                      <div className="flex items-center mt-1 text-xs text-zinc-500">
                        <User className="h-3 w-3 mr-1" />
                        To: {formatAddress(payment.recipient)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Middle - Additional details */}
                  <div className="space-y-3 bg-zinc-800/60 rounded-lg p-3 md:min-w-48">
                    <div className="flex items-center gap-3 text-sm text-zinc-300">
                      <Clock className="h-4 w-4 text-emerald-400" />
                      <div className="flex flex-col">
                        <span className="text-xs text-zinc-500">Frequency</span>
                        <span className="font-medium">{formatPeriod(payment.interval)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-zinc-300">
                      <Calendar className="h-4 w-4 text-emerald-400" />
                      <div className="flex flex-col">
                        <span className="text-xs text-zinc-500">Next Payment</span>
                        <span className={`font-medium ${isReadyToProcess ? 'text-emerald-400' : ''}`}>
                          {nextTime === "Ready" ? "Ready now" : `in ${nextTime}`}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right side - Status and actions */}
                  <div className="flex flex-col gap-3">
                    {nextTime === "Ready" ? (
                      payment.canProcess ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleProcessPayment(id)}
                          disabled={isProcessing}
                          className={`px-4 py-2 rounded-xl font-medium focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed
                          ${isProcessing ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-500 text-black hover:bg-emerald-400'} 
                          transition-all duration-200 flex items-center justify-center gap-2`}
                        >
                          {isProcessing ? (
                            <>
                              <div className="h-4 w-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                              <span>Processing...</span>
                            </>
                          ) : (
                            <>
                              <ArrowDownCircle className="h-4 w-4" />
                              <span>Process Payment</span>
                            </>
                          )}
                        </motion.button>
                      ) : (
                        <div className="px-4 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 flex items-center gap-2 text-sm">
                          <InfoIcon className="h-4 w-4 flex-shrink-0" />
                          <span>{payment.reasonNotProcessable || "Time ready but contract not ready"}</span>
                        </div>
                      )
                    ) : (
                      <div className="px-4 py-2 rounded-xl bg-zinc-800/60 border border-zinc-700/50 text-zinc-400 flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4" />
                        <span>Wait {nextTime}</span>
                      </div>
                    )}
                    
                    <div className="px-4 py-2 rounded-xl bg-zinc-800/60 border border-zinc-700/50 text-zinc-400 flex items-center gap-2 text-sm">
                      <Shield className="h-4 w-4 text-emerald-500" />
                      <span>Protected by Smart Contract</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}