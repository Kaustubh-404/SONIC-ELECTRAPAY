// "use client";

// import { useEffect, useState, useRef } from "react";
// import { useAccount } from "wagmi";
// import { Card, CardContent } from "@/components/ui/card";
// import { Globe, AlertCircle, Wallet, Check, RefreshCw } from "lucide-react";
// import { motion } from "framer-motion";

// // Define types for the deBridge widget
// interface DeBridgeWidget {
//   setExternalEVMWallet: (params: { provider: any, name: string, imageSrc: string }) => void;
//   setReceiverAddress: (address: string) => void;
//   on: (event: string, callback: (params?: any) => void) => void;
// }

// // Add deBridge to the Window interface
// declare global {
//   interface Window {
//     deBridge?: {
//       widget: (params: any) => Promise<DeBridgeWidget>;
//     };
//     ethereum?: any;
//   }
// }

// export function DeBridgeWidgetComponent() {
//   const { address } = useAccount();
//   const [error, setError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isInitialized, setIsInitialized] = useState(false);
//   const mountPointRef = useRef<HTMLDivElement>(null);
  
//   // Load the deBridge script
//   useEffect(() => {
//     if (!address) {
//       setIsLoading(false);
//       return;
//     }
    
//     // Start fresh
//     setIsLoading(true);
//     setError(null);
//     setIsInitialized(false);
    
//     // Check if script is already loaded
//     const scriptId = "debridge-widget-script";
    
//     const loadScript = () => {
//       return new Promise<void>((resolve, reject) => {
//         if (document.getElementById(scriptId)) {
//           console.log("deBridge script already loaded");
//           resolve();
//           return;
//         }
        
//         const newScript = document.createElement("script");
//         newScript.id = scriptId;
//         newScript.src = "https://app.debridge.finance/assets/scripts/widget.js";
//         newScript.async = true;
        
//         newScript.onload = () => {
//           console.log("deBridge script loaded successfully");
//           resolve();
//         };
        
//         newScript.onerror = (e) => {
//           console.error("Failed to load deBridge script", e);
//           reject(new Error("Failed to load deBridge widget script"));
//         };
        
//         document.head.appendChild(newScript);
//       });
//     };
    
//     // Wait for DOM to be ready and ref to be attached
//     const initializeWidget = async () => {
//       try {
//         // First ensure the ref is available
//         if (!mountPointRef.current) {
//           console.log("Waiting for mount point ref...");
//           // Let's return and wait for the next render cycle
//           return;
//         }
        
//         // First ensure script is loaded
//         await loadScript();
        
//         // Wait a bit to make sure everything is fully initialized
//         await new Promise(resolve => setTimeout(resolve, 1000));
        
//         // Clear mount point and create container
//         mountPointRef.current.innerHTML = '';
        
//         const containerId = "debridge-widget-container";
//         const containerElement = document.createElement("div");
//         containerElement.id = containerId;
//         containerElement.style.width = "100%";
//         containerElement.style.height = "600px";
        
//         mountPointRef.current.appendChild(containerElement);
//         console.log("Widget container created:", containerId);
        
//         // Ensure deBridge is available
//         if (!window.deBridge || typeof window.deBridge.widget !== 'function') {
//           throw new Error("deBridge API not available, please reload the page");
//         }
        
//         // Setup widget config
//         const widgetConfig = {
//           element: containerId,
//           v: "1",
//           mode: "deswap",
//           title: "ElectraPay Cross-Chain",
//           width: "100%",
//           height: "600",
//           inputChain: "1", 
//           outputChain: "137",
//           inputCurrency: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
//           outputCurrency: "0x0000000000000000000000000000000000001010",
//           address: address,
//           lang: "en",
//           theme: "dark",
//           styles: btoa(JSON.stringify({
//             fontFamily: "Inter, sans-serif",
//             borderRadius: 12,
//             primary: "#10b981",
//             secondary: "#064e3b",
//             badge: "rgba(16, 185, 129, 0.1)",
//             borderColor: "rgba(255, 255, 255, 0.1)",
//             appBackground: "#18181b",
//             appAccentBg: "#27272a",
//             chartBg: "#18181b", 
//             fontColor: "#ffffff",
//             fontColorAccent: "#10b981"
//           }))
//         };
        
//         console.log("Initializing widget with config:", widgetConfig);
        
//         try {
//           // Initialize widget
//           const widget = await window.deBridge.widget(widgetConfig);
//           console.log("Widget initialized successfully");
          
//           // Connect wallet if available
//           if (window.ethereum) {
//             console.log("Setting external wallet");
//             widget.setExternalEVMWallet({
//               provider: window.ethereum,
//               name: "Connected Wallet",
//               imageSrc: 'https://app.debridge.finance/assets/images/wallet/metamask.svg'
//             });
            
//             widget.setReceiverAddress(address);
//           }
          
//           setIsInitialized(true);
//           setIsLoading(false);
//         } catch (widgetError) {
//           console.error("Widget initialization error:", widgetError);
//           setError(`Widget initialization failed: ${widgetError instanceof Error ? widgetError.message : String(widgetError)}`);
//           setIsLoading(false);
//         }
//       } catch (err: unknown) {
//         console.error("Widget initialization error:", err);
//         setError(`${err instanceof Error ? err.message : String(err)}`);
//         setIsLoading(false);
//       }
//     };
    
//     // Run initialization
//     initializeWidget();
    
//     // We need to monitor for DOM updates to ensure our ref is attached
//     // This is a safety check in case the initial initialization fails
//     const checkRefInterval = setInterval(() => {
//       if (mountPointRef.current && !isInitialized && !error) {
//         initializeWidget();
//       }
//     }, 500);
    
//     // Clean up interval on unmount
//     return () => {
//       clearInterval(checkRefInterval);
//     };
//   }, [address, isInitialized, error]);
  
//   const handleRefresh = () => {
//     window.location.reload();
//   };
  
//   return (
//     <Card className="bg-zinc-800/40 border border-zinc-700/50 backdrop-blur-sm h-full hover:border-emerald-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5">
//       <CardContent className="p-6">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-2xl font-semibold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent flex items-center gap-2">
//             Cross-Chain Transfer
//             <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-normal flex items-center">
//               <Globe className="h-3 w-3 mr-1" />
//               deBridge
//             </span>
//           </h2>
//         </div>
        
//         {!address ? (
//           <motion.div 
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.4 }}
//             className="text-center p-6 bg-yellow-500/10 backdrop-blur-sm border border-yellow-500/30 text-yellow-300 rounded-xl shadow-lg flex items-center justify-center gap-3"
//           >
//             <Wallet className="h-5 w-5" />
//             <span className="font-medium">Please connect your wallet to use deBridge</span>
//           </motion.div>
//         ) : error ? (
//           <motion.div 
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.4 }}
//             className="text-center p-6 bg-red-500/10 backdrop-blur-sm border border-red-500/30 text-red-400 rounded-xl shadow-lg flex items-center justify-center gap-3"
//           >
//             <AlertCircle className="h-5 w-5 flex-shrink-0" />
//             <span className="font-medium">{error}</span>
//             <button 
//               onClick={handleRefresh}
//               className="ml-2 px-3 py-1 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors flex items-center gap-1"
//             >
//               <RefreshCw className="h-3 w-3" />
//               Reload
//             </button>
//           </motion.div>
//         ) : isLoading ? (
//           <div className="p-6 flex flex-col items-center justify-center space-y-4">
//             <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
//             <div className="text-emerald-300">Loading deBridge Widget...</div>
//           </div>
//         ) : (
//           <div 
//             ref={mountPointRef}
//             className="relative h-[600px] w-full rounded-xl overflow-hidden"
//           >
//             {/* Widget container will be created here via script */}
//           </div>
//         )}
        
//         {isInitialized && (
//           <motion.div 
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.4, delay: 0.3 }}
//             className="mt-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-lg text-sm flex items-center gap-2"
//           >
//             <Check className="h-4 w-4 flex-shrink-0" />
//             <span>deBridge provides secure cross-chain transfers across multiple blockchains</span>
//           </motion.div>
//         )}
//       </CardContent>
//     </Card>
//   );
// }

// //========================
// "use client";

// import { useEffect, useState } from "react";
// import { useAccount } from "wagmi";
// import { Card, CardContent } from "@/components/ui/card";
// import { Globe, AlertCircle, Wallet, Check, RefreshCw } from "lucide-react";
// import { motion } from "framer-motion";

// // Add deBridge to the Window interface
// declare global {
//   interface Window {
//     deBridge?: any;
//     ethereum?: any;
//   }
// }

// export function DeBridgeWidgetComponent() {
//   const { address } = useAccount();
//   const [error, setError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isInitialized, setIsInitialized] = useState(false);
  
//   // Handle page refresh
//   const handleRefresh = () => {
//     window.location.reload();
//   };
  
//   // Reset the component and try again
//   const handleTryAgain = () => {
//     setIsLoading(true);
//     setError(null);
//     setIsInitialized(false);
//   };
  
//   // Initialize widget when component mounts
//   useEffect(() => {
//     // If no wallet is connected, don't try to load the widget
//     if (!address) {
//       setIsLoading(false);
//       return;
//     }
    
//     // Reset state
//     setIsLoading(true);
//     setError(null);
//     setIsInitialized(false);
    
//     // The IDs we'll use for our elements
//     const parentId = "debridge-widget-parent";
//     const containerId = "debridgeWidget";
    
//     // Function to load the script
//     const loadScript = () => {
//       return new Promise<void>((resolve, reject) => {
//         const scriptId = "debridge-widget-script";
        
//         // Check if script is already loaded
//         if (document.getElementById(scriptId)) {
//           console.log("deBridge script already loaded");
//           resolve();
//           return;
//         }
        
//         // Create script element
//         const script = document.createElement("script");
//         script.id = scriptId;
//         script.src = "https://app.debridge.finance/assets/scripts/widget.js";
//         script.async = true;
        
//         script.onload = () => {
//           console.log("deBridge script loaded successfully");
//           resolve();
//         };
        
//         script.onerror = (e) => {
//           console.error("Failed to load deBridge script", e);
//           reject(new Error("Failed to load deBridge widget script"));
//         };
        
//         document.head.appendChild(script);
//       });
//     };
    
//     // Create a function to initialize the widget
//     const initializeWidget = async () => {
//       try {
//         // Wait a brief moment for React to render the DOM elements
//         await new Promise(resolve => setTimeout(resolve, 500));
        
//         // Find our parent div within the component
//         const parent = document.getElementById(parentId);
        
//         if (!parent) {
//           console.error("Widget parent element not found:", parentId);
//           setError("Widget parent element not found. Please try again.");
//           setIsLoading(false);
//           return;
//         }
        
//         // Clear parent and add container
//         parent.innerHTML = '';
        
//         // Create container element
//         const container = document.createElement("div");
//         container.id = containerId;
//         parent.appendChild(container);
//         console.log("Created widget container:", containerId);
        
//         // Load script first
//         await loadScript();
        
//         // Wait a bit to make sure script is fully loaded
//         await new Promise(resolve => setTimeout(resolve, 500));
        
//         // Check if deBridge is available
//         if (!window.deBridge || typeof window.deBridge.widget !== 'function') {
//           throw new Error("deBridge API not available");
//         }
        
//         // Check again that container exists
//         const widgetContainer = document.getElementById(containerId);
//         if (!widgetContainer) {
//           throw new Error("Widget container doesn't exist in DOM");
//         }
        
//         // Widget configuration
//         const widgetConfig = {
//           element: containerId,
//           v: "1",
//           mode: "deswap",
//           title: "ElectraPay Cross-Chain",
//           width: "100%",
//           height: "600",
//           inputChain: "1", // Ethereum
//           outputChain: "137", // Polygon
//           inputCurrency: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", // Native ETH
//           outputCurrency: "0x0000000000000000000000000000000000001010", // Native MATIC
//           address: address,
//           lang: "en",
//           theme: "dark",
//           styles: btoa(JSON.stringify({
//             fontFamily: "Inter, sans-serif",
//             borderRadius: 12,
//             primary: "#10b981",
//             secondary: "#064e3b",
//             badge: "rgba(16, 185, 129, 0.1)",
//             borderColor: "rgba(255, 255, 255, 0.1)",
//             appBackground: "#18181b",
//             appAccentBg: "#27272a",
//             chartBg: "#18181b", 
//             fontColor: "#ffffff",
//             fontColorAccent: "#10b981"
//           }))
//         };
        
//         console.log("Initializing widget with config:", widgetConfig);
        
//         // Initialize widget
//         const widget = await window.deBridge.widget(widgetConfig);
//         console.log("Widget initialized successfully");
        
//         // Connect wallet if available
//         if (window.ethereum) {
//           widget.setExternalEVMWallet({
//             provider: window.ethereum,
//             name: "Connected Wallet",
//             imageSrc: 'https://app.debridge.finance/assets/images/wallet/metamask.svg'
//           });
          
//           // Set receiver address to connected wallet
//           widget.setReceiverAddress(address);
//         }
        
//         // Set up basic event handlers
//         widget.on('needConnect', () => {
//           console.log('Widget needs wallet connection');
//         });
        
//         widget.on('order', (_: any, params: any) => {
//           console.log('Order created:', params);
//         });
        
//         widget.on('bridge', (_: any, params: any) => {
//           console.log('Bridge transaction:', params);
//         });
        
//         // Update state to show widget is initialized
//         setIsInitialized(true);
//         setIsLoading(false);
        
//       } catch (err: unknown) {
//         console.error("Widget initialization error:", err);
//         const errorMessage = err instanceof Error ? err.message : String(err);
//         setError(`Widget initialization failed: ${errorMessage}`);
//         setIsLoading(false);
//       }
//     };
    
//     // Start the initialization process
//     initializeWidget();
    
//     // Add a timeout to prevent infinite loading
//     const loadingTimeout = setTimeout(() => {
//       if (isLoading) {
//         setError("Widget initialization timed out. Please try again.");
//         setIsLoading(false);
//       }
//     }, 20000); // 20 second timeout
    
//     // Clean up
//     return () => {
//       clearTimeout(loadingTimeout);
//     };
//   }, [address, isLoading]);
  
//   return (
//     <Card className="bg-zinc-800/40 border border-zinc-700/50 backdrop-blur-sm h-full hover:border-emerald-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5">
//       <CardContent className="p-6">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-2xl font-semibold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent flex items-center gap-2">
//             Cross-Chain Transfer
//             <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-normal flex items-center">
//               <Globe className="h-3 w-3 mr-1" />
//               deBridge
//             </span>
//           </h2>
//         </div>
        
//         {!address ? (
//           <motion.div 
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.4 }}
//             className="text-center p-6 bg-yellow-500/10 backdrop-blur-sm border border-yellow-500/30 text-yellow-300 rounded-xl shadow-lg flex items-center justify-center gap-3"
//           >
//             <Wallet className="h-5 w-5" />
//             <span className="font-medium">Please connect your wallet to use deBridge</span>
//           </motion.div>
//         ) : error ? (
//           <motion.div 
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.4 }}
//             className="text-center p-6 bg-red-500/10 backdrop-blur-sm border border-red-500/30 text-red-400 rounded-xl shadow-lg flex flex-col items-center justify-center gap-3"
//           >
//             <div className="flex items-center gap-2">
//               <AlertCircle className="h-5 w-5 flex-shrink-0" />
//               <span className="font-medium">{error}</span>
//             </div>
//             <div className="flex gap-2 mt-2">
//               <button 
//                 onClick={handleRefresh}
//                 className="px-3 py-1 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors flex items-center gap-1"
//               >
//                 <RefreshCw className="h-3 w-3" />
//                 Reload Page
//               </button>
//               <button 
//                 onClick={handleTryAgain}
//                 className="px-3 py-1 bg-emerald-500/20 rounded-lg hover:bg-emerald-500/30 transition-colors flex items-center gap-1 text-emerald-400"
//               >
//                 <RefreshCw className="h-3 w-3" />
//                 Try Again
//               </button>
//             </div>
//           </motion.div>
//         ) : isLoading ? (
//           <div className="p-6 flex flex-col items-center justify-center space-y-4">
//             <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
//             <div className="text-emerald-300">Loading deBridge Widget...</div>
//           </div>
//         ) : (
//           <div 
//             id="debridge-widget-parent"
//             className="relative h-[600px] w-full rounded-xl overflow-hidden"
//           >
//             {/* Widget will be attached here */}
//           </div>
//         )}
        
//         {isInitialized && (
//           <motion.div 
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.4, delay: 0.3 }}
//             className="mt-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-lg text-sm flex items-center gap-2"
//           >
//             <Check className="h-4 w-4 flex-shrink-0" />
//             <span>deBridge provides secure cross-chain transfers across multiple blockchains</span>
//           </motion.div>
//         )}
//       </CardContent>
//     </Card>
//   );
// }




// import React, { useEffect, useRef, useState } from "react";

// declare global {
//   interface Window {
//     ethereum?: any; // Override TypeScript's conflicting definition
//     deBridge?: {
//       Widget: {
//         init: (config: { parentId: string; config: object }) => {
//           disconnect: () => void;
//         };
//       };
//     };
//   }
// }

// const DeBridgeWidgetComponent: React.FC = () => {
//   const widgetRef = useRef<HTMLDivElement>(null);
//   const [isLoaded, setIsLoaded] = useState(false);
//   const [walletConnected, setWalletConnected] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [widgetInstance, setWidgetInstance] = useState<{ disconnect: () => void } | null>(null);
//   const parentId = "debridge-widget-container";

//   // ✅ Connect Wallet Before Loading Widget
//   useEffect(() => {
//     const connectWallet = async () => {
//       try {
//         if (!window.ethereum) {
//           throw new Error("No Ethereum provider found. Install MetaMask or another wallet.");
//         }
//         await window.ethereum.request({ method: "eth_requestAccounts" });
//         console.log("Wallet connected successfully.");
//         setWalletConnected(true);
//       } catch (err) {
//         console.error("Wallet connection failed:", err);
//         setError("Wallet connection is required to use DeBridge.");
//       }
//     };

//     connectWallet();
//   }, []);

//   // ✅ Load DeBridge Script Once
//   useEffect(() => {
//     if (!walletConnected) return;

//     const scriptId = "debridge-widget-script";

//     const loadScript = () => {
//       if (document.getElementById(scriptId)) {
//         setIsLoaded(true);
//         return;
//       }

//       console.log("Loading DeBridge script...");
//       const script = document.createElement("script");
//       script.id = scriptId;
//       script.src = "https://app.debridge.finance/assets/scripts/widget.js";
//       script.async = true;

//       script.onload = () => {
//         console.log("DeBridge script loaded successfully.");
//         setIsLoaded(true);
//       };

//       script.onerror = () => {
//         console.error("Failed to load the DeBridge widget script.");
//         setError("Failed to load the DeBridge widget script.");
//       };

//       document.body.appendChild(script);
//     };

//     loadScript();

//     return () => {
//       console.log("Removing DeBridge script...");
//       const script = document.getElementById(scriptId);
//       if (script) script.remove();
//     };
//   }, [walletConnected]);

//   // ✅ Initialize Widget After Wallet Connection & Script Load
//   useEffect(() => {
//     if (isLoaded && walletConnected && window.deBridge?.Widget) {
//       try {
//         console.log("Initializing DeBridge widget...");
//         const instance = window.deBridge.Widget.init({
//           parentId,
//           config: {
//             defaultFrom: "ETH",
//             defaultTo: "USDT",
//             defaultFromChain: "ethereum",
//             defaultToChain: "bsc",
//             amount: 0.01,
//             fee: 0,
//           },
//         });

//         setWidgetInstance(instance);
//         console.log("DeBridge widget initialized successfully.");
//       } catch (err) {
//         console.error("Failed to initialize the DeBridge widget.", err);
//         setError("Failed to initialize the DeBridge widget.");
//       }
//     }
//   }, [isLoaded, walletConnected]);

//   // ✅ Clean up widget on unmount
//   useEffect(() => {
//     return () => {
//       if (widgetInstance) {
//         console.log("Disconnecting DeBridge widget...");
//         widgetInstance.disconnect();
//       }
//     };
//   }, [widgetInstance]);

//   // ✅ Handle Errors
//   if (error) {
//     return (
//       <div className="text-red-500">
//         <p>{error}</p>
//         <button
//           onClick={() => window.location.reload()}
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//         >
//           Reload
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <h2 className="text-lg font-semibold mb-2">DeBridge Widget</h2>
//       <div ref={widgetRef} id={parentId} className="w-full h-[500px] bg-gray-100" />
//     </div>
//   );
// };

// export default DeBridgeWidgetComponent;



// import React, { useEffect, useRef, useState } from "react";

// declare global {
//   interface Window {
//     ethereum?: any;
//     deBridge?: {
//       Widget?: {
//         init: (config: { parentId: string; config: object }) => {
//           disconnect: () => void;
//         };
//       };
//     };
//   }
// }

// interface DeBridgeWidgetProps {
//   defaultFrom?: string;
//   defaultTo?: string;
//   defaultFromChain?: string;
//   defaultToChain?: string;
//   amount?: number;
// }

// const DeBridgeWidgetComponent: React.FC<DeBridgeWidgetProps> = ({
//   defaultFrom = "ETH",
//   defaultTo = "USDT",
//   defaultFromChain = "ethereum",
//   defaultToChain = "bsc",
//   amount = 0.01,
// }) => {
//   const widgetRef = useRef<HTMLDivElement>(null);
//   const widgetInstanceRef = useRef<{ disconnect: () => void } | null>(null);
//   const [isLoaded, setIsLoaded] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const parentId = "debridge-widget-container";

//   useEffect(() => {
//     const scriptId = "debridge-widget-script";

//     const loadScript = () => {
//       if (window.deBridge?.Widget) {
//         console.log("DeBridge script already available.");
//         setIsLoaded(true);
//         return;
//       }

//       if (document.getElementById(scriptId)) {
//         console.log("DeBridge script already loading.");
//         return;
//       }

//       console.log("Loading DeBridge script...");
//       const script = document.createElement("script");
//       script.id = scriptId;
//       script.src = "https://app.debridge.finance/assets/scripts/widget.js";
//       script.async = true;

//       script.onload = () => {
//         console.log("DeBridge script loaded successfully.");
//         setIsLoaded(true);
//       };

//       script.onerror = () => {
//         setError("Failed to load the DeBridge widget script.");
//         console.error("Error loading DeBridge script.");
//       };

//       document.body.appendChild(script);
//     };

//     loadScript();

//     return () => {
//       const script = document.getElementById(scriptId);
//       if (script) script.remove();
//     };
//   }, []);

//   useEffect(() => {
//     if (isLoaded && window.deBridge?.Widget) {
//       try {
//         console.log("Initializing DeBridge widget...");
//         widgetInstanceRef.current = window.deBridge.Widget.init({
//           parentId,
//           config: {
//             defaultFrom,
//             defaultTo,
//             defaultFromChain,
//             defaultToChain,
//             amount,
//             fee: 0,
//           },
//         });

//         console.log("DeBridge widget initialized.");
//       } catch (err) {
//         setError("Failed to initialize the DeBridge widget.");
//         console.error("Widget initialization error:", err);
//       }
//     } else {
//       console.warn("DeBridge widget not available yet.");
//     }

//     return () => {
//       if (widgetInstanceRef.current) {
//         widgetInstanceRef.current.disconnect();
//         console.log("DeBridge widget disconnected.");
//       }
//     };
//   }, [isLoaded, defaultFrom, defaultTo, defaultFromChain, defaultToChain, amount]);

//   if (error) {
//     return (
//       <div className="text-red-500">
//         <p>{error}</p>
//         <button onClick={() => window.location.reload()} className="bg-blue-500 text-white px-4 py-2 rounded">
//           Reload
//         </button>
//       </div>
//     );
//   }

//   return <div ref={widgetRef} id={parentId} className="w-full h-[500px] border border-gray-300" />;
// };

// export default DeBridgeWidgetComponent;




// "use client";

// import Script from "next/script";
// import { useEffect, useRef, useState } from "react";

// declare global {
//   interface Window {
//     ethereum?: any;
//     deBridge?: {
//       // Support both API styles
//       widget?: (config: any) => void;
//       Widget?: {
//         init: (config: { parentId: string; config: object }) => {
//           disconnect: () => void;
//         };
//       };
//     };
//   }
// }

// interface DeBridgeWidgetProps {
//   defaultFrom?: string;
//   defaultTo?: string;
//   defaultFromChain?: string;
//   defaultToChain?: string;
//   amount?: number;
//   className?: string;
//   height?: string;
// }

// const DeBridgeWidgetComponent: React.FC<DeBridgeWidgetProps> = ({
//   defaultFrom = "ETH",
//   defaultTo = "USDT",
//   defaultFromChain = "ethereum",
//   defaultToChain = "bsc",
//   amount = 0.01,
//   className = "",
//   height = "500px"
// }) => {
//   const widgetRef = useRef<HTMLDivElement>(null);
//   const widgetInstanceRef = useRef<{ disconnect: () => void } | null>(null);
//   const [isScriptLoaded, setIsScriptLoaded] = useState(false);
//   const [isWalletConnected, setIsWalletConnected] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const parentId = "debridge-widget-container";
//   const initAttempted = useRef(false);

//   // Connect wallet function
//   const connectWallet = async () => {
//     if (!window.ethereum) {
//       setError("No Ethereum provider found. Please install MetaMask or another wallet provider.");
//       return false;
//     }

//     try {
//       console.log("Requesting wallet connection...");
//       const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      
//       if (accounts && accounts.length > 0) {
//         console.log("Wallet connected successfully:", accounts[0]);
//         setIsWalletConnected(true);
//         return true;
//       } else {
//         setError("No accounts found after connecting wallet.");
//         return false;
//       }
//     } catch (err: any) {
//       console.error("Wallet connection error:", err);
//       setError(`Failed to connect wallet: ${err.message || "Unknown error"}`);
//       return false;
//     }
//   };

//   // Load the DeBridge script
//   useEffect(() => {
//     const scriptId = "debridge-widget-script";

//     // Check if script is already loaded
//     if (typeof window.deBridge !== "undefined") {
//       console.log("DeBridge is already available in window object");
//       setIsScriptLoaded(true);
//       return;
//     }

//     if (document.getElementById(scriptId)) {
//       console.log("DeBridge script tag already exists in DOM");
//       return;
//     }

//     console.log("Loading DeBridge script...");
//     const script = document.createElement("script");
//     script.id = scriptId;
//     script.src = "https://app.debridge.finance/assets/scripts/widget.js";
//     script.async = true;

//     script.onload = () => {
//       console.log("DeBridge script loaded successfully");
//       // Add a small delay to ensure script initialization
//       setTimeout(() => {
//         setIsScriptLoaded(true);
//       }, 500);
//     };

//     script.onerror = (e) => {
//       console.error("Error loading DeBridge script:", e);
//       setError("Failed to load the DeBridge widget script");
//     };

//     document.body.appendChild(script);

//     // Cleanup function
//     return () => {
//       if (widgetInstanceRef.current) {
//         try {
//           widgetInstanceRef.current.disconnect();
//           console.log("DeBridge widget disconnected during cleanup");
//         } catch (err) {
//           console.error("Error disconnecting widget", err);
//         }
//       }
//     };
//   }, []);

//   // Auto-connect wallet when script is loaded
//   useEffect(() => {
//     if (isScriptLoaded && !isWalletConnected && !initAttempted.current) {
//       connectWallet();
//     }
//   }, [isScriptLoaded, isWalletConnected]);

//   // Initialize widget when wallet is connected
//   useEffect(() => {
//     // Only proceed if script is loaded and wallet is connected
//     if (!isScriptLoaded || !isWalletConnected || initAttempted.current) {
//       return;
//     }

//     const initializeWidget = async () => {
//       initAttempted.current = true;
//       console.log("Initializing DeBridge widget...");

//       // Give a moment for everything to be ready
//       await new Promise(resolve => setTimeout(resolve, 300));

//       try {
//         // Check which API version is available
//         if (window.deBridge?.Widget) {
//           // Using the original API style from your commented code
//           console.log("Using DeBridge.Widget.init API");
//           widgetInstanceRef.current = window.deBridge.Widget.init({
//             parentId,
//             config: {
//               defaultFrom,
//               defaultTo,
//               defaultFromChain,
//               defaultToChain,
//               amount,
//               fee: 0,
//             },
//           });
//         } else if (window.deBridge?.widget) {
//           // Using the newer widget API
//           console.log("Using deBridge.widget API");
//           window.deBridge.widget({
//             v: "1",
//             element: parentId,
//             title: "Cross-Chain Swap",
//             description: "Swap tokens across chains",
//             width: "100%",
//             height: height,
//             supportedChains: '{"inputChains":{"1":"all","10":"all","56":"all","100":"all","137":"all","1088":"all","1890":"all","7171":"all","8453":"all","42161":"all","43114":"all","59144":"all","7565164":"all","245022934":"all"},"outputChains":{"1":"all","10":"all","56":"all","100":"all","137":"all","1088":"all","1890":"all","7171":"all","8453":"all","42161":"all","43114":"all","59144":"all","7565164":"all","245022934":"all"}}',
//             inputChain: defaultFromChain === "ethereum" ? 1 : 56, // Map string names to chain IDs
//             outputChain: defaultToChain === "bsc" ? 56 : 1, // Map string names to chain IDs
//             inputCurrency: defaultFrom,
//             outputCurrency: defaultTo,
//             address: "",
//             showSwapTransfer: true,
//             amount: amount.toString(),
//             isAmountFromNotModifiable: false,
//             lang: "en",
//             mode: "deswap",
//             isEnableCalldata: false,
//             theme: "dark",
//             isHideLogo: false,
//           });
//         } else {
//           throw new Error("DeBridge API not available in window object");
//         }

//         console.log("DeBridge widget initialized successfully");
//       } catch (err: any) {
//         console.error("Widget initialization error:", err);
//         setError(`Failed to initialize widget: ${err.message || "Unknown error"}`);
//         initAttempted.current = false;
//       }
//     };

//     initializeWidget();
//   }, [isScriptLoaded, isWalletConnected, defaultFrom, defaultTo, defaultFromChain, defaultToChain, amount, height]);

//   // Add wallet event listeners
//   useEffect(() => {
//     if (!window.ethereum) return;
    
//     const handleAccountsChanged = (accounts: string[]) => {
//       if (accounts.length === 0) {
//         console.log("Wallet disconnected");
//         setIsWalletConnected(false);
//         initAttempted.current = false;
//       } else {
//         console.log("Accounts changed:", accounts[0]);
//         setIsWalletConnected(true);
//       }
//     };
    
//     const handleChainChanged = () => {
//       console.log("Chain changed, reloading page");
//       window.location.reload();
//     };
    
//     window.ethereum.on('accountsChanged', handleAccountsChanged);
//     window.ethereum.on('chainChanged', handleChainChanged);
    
//     // Check if already connected
//     window.ethereum.request({ method: 'eth_accounts' })
//       .then((accounts: string[]) => {
//         if (accounts && accounts.length > 0) {
//           console.log("Wallet already connected:", accounts[0]);
//           setIsWalletConnected(true);
//         }
//       })
//       .catch(console.error);
    
//     return () => {
//       window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
//       window.ethereum.removeListener('chainChanged', handleChainChanged);
//     };
//   }, []);

//   const handleRetry = () => {
//     setError(null);
//     initAttempted.current = false;
//     connectWallet();
//   };

//   if (error) {
//     return (
//       <div className="text-red-500">
//         <p>{error}</p>
//         <button onClick={handleRetry} className="bg-blue-500 text-white px-4 py-2 rounded">
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <>
//       {!isScriptLoaded && (
//         <div className="flex justify-center items-center h-[500px]">
//           <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
//         </div>
//       )}
      
//       {isScriptLoaded && !isWalletConnected && (
//         <div className="flex flex-col items-center justify-center h-[500px] border border-gray-300">
//           <p className="mb-4">Wallet connection required to use DeBridge</p>
//           <button 
//             onClick={connectWallet} 
//             className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
//           >
//             Connect Wallet
//           </button>
//         </div>
//       )}
      
//       <div 
//         ref={widgetRef} 
//         id={parentId} 
//         className={`${className} ${!isWalletConnected ? 'hidden' : ''}`}
//         style={{ height: height }}
//       />
//     </>
//   );
// };

// export default DeBridgeWidgetComponent;

// //======================================================
// "use client";

// import { useEffect, useRef, useState } from "react";

// declare global {
//   interface Window {
//     ethereum?: any;
//     deBridge?: {
//       widget?: (config: any) => void;
//       Widget?: {
//         init: (config: { parentId: string; config: object }) => {
//           disconnect: () => void;
//         };
//       };
//     };
//     Zone?: any; // Add Zone type for patching
//   }
// }

// interface DeBridgeWidgetProps {
//   defaultFrom?: string;
//   defaultTo?: string;
//   defaultFromChain?: string;
//   defaultToChain?: string;
//   amount?: number;
//   className?: string;
//   height?: string;
// }

// const DeBridgeWidgetComponent: React.FC<DeBridgeWidgetProps> = ({
//   defaultFrom = "ETH",
//   defaultTo = "USDT",
//   defaultFromChain = "ethereum",
//   defaultToChain = "bsc",
//   amount = 0.01,
//   className = "",
//   height = "500px"
// }) => {
//   const widgetRef = useRef<HTMLDivElement>(null);
//   const widgetInstanceRef = useRef<{ disconnect: () => void } | null>(null);
//   const [isScriptLoaded, setIsScriptLoaded] = useState(false);
//   const [isWalletConnected, setIsWalletConnected] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const parentId = "debridge-widget-container";
//   const initAttempted = useRef(false);
//   const zonePatchApplied = useRef(false);

//   // Add Zone.js error patch - this fixes the unhandled rejection errors
//   useEffect(() => {
//     if (zonePatchApplied.current) return;

//     // Create a script element for our patch
//     const patchScript = document.createElement('script');
//     patchScript.id = 'zone-patch-script';
//     patchScript.innerHTML = `
//       (function() {
//         // This function runs immediately and patches the Zone.js error handling
//         const originalOnUnhandledError = window.Zone && 
//           window.Zone.__load_patch && 
//           window.Zone.__load_patch.r && 
//           window.Zone.__load_patch.r.onUnhandledError;
        
//         if (originalOnUnhandledError) {
//           // Replace the error handler to suppress unhandled rejection errors
//           window.Zone.__load_patch.r.onUnhandledError = function(e) {
//             // Check if this is from deBridge widget
//             if (e && e.rejection && 
//                 ((e.rejection.code === 4100) || 
//                  (e.stack && e.stack.includes('debridge')) || 
//                  (e.message && e.message.includes('eth_requestAccounts')))) {
//               // Suppress the error by doing nothing
//               console.log('Suppressed DeBridge error:', e.rejection || e);
//               return;
//             }
            
//             // For all other errors, use the original handler
//             return originalOnUnhandledError.apply(this, arguments);
//           };
//           console.log('Zone.js error handler patched successfully');
//         }
//       })();
//     `;

//     // Add the patch script to the document
//     document.head.appendChild(patchScript);
//     zonePatchApplied.current = true;

//     return () => {
//       // Remove the patch script on cleanup
//       const script = document.getElementById('zone-patch-script');
//       if (script) script.remove();
//     };
//   }, []);

//   // Connect wallet function
//   const connectWallet = async () => {
//     if (!window.ethereum) {
//       setError("No Ethereum provider found. Please install MetaMask or another wallet provider.");
//       return false;
//     }

//     try {
//       console.log("Requesting wallet connection...");
//       // Add a timeout to the wallet request to prevent hanging
//       const accounts = await Promise.race([
//         window.ethereum.request({ method: "eth_requestAccounts" }),
//         new Promise<null>((_, reject) => 
//           setTimeout(() => reject(new Error("Wallet connection timed out")), 30000)
//         )
//       ]);
      
//       if (accounts && Array.isArray(accounts) && accounts.length > 0) {
//         console.log("Wallet connected successfully:", accounts[0]);
//         setIsWalletConnected(true);
//         return true;
//       } else {
//         setError("No accounts found after connecting wallet.");
//         return false;
//       }
//     } catch (error: unknown) {
//       const err = error instanceof Error ? error : new Error(String(error));
      
//       // Don't treat user rejection as an error
//       if ('code' in err && (err as any).code === 4001) {
//         console.log("User rejected wallet connection");
//         return false;
//       }
      
//       console.error("Wallet connection error:", err);
//       setError(`Failed to connect wallet: ${err.message || "Unknown error"}`);
//       return false;
//     }
//   };

//   // Load the DeBridge script
//   useEffect(() => {
//     const scriptId = "debridge-widget-script";

//     // Check if script is already loaded
//     if (typeof window.deBridge !== "undefined") {
//       console.log("DeBridge is already available in window object");
//       setIsScriptLoaded(true);
//       return;
//     }

//     if (document.getElementById(scriptId)) {
//       console.log("DeBridge script tag already exists in DOM");
//       return;
//     }

//     console.log("Loading DeBridge script...");
//     const script = document.createElement("script");
//     script.id = scriptId;
//     script.src = "https://app.debridge.finance/assets/scripts/widget.js";
//     script.async = true;

//     script.onload = () => {
//       console.log("DeBridge script loaded successfully");
//       // Add a small delay to ensure script initialization
//       setTimeout(() => {
//         setIsScriptLoaded(true);
//       }, 500);
//     };

//     script.onerror = (e) => {
//       console.error("Error loading DeBridge script:", e);
//       setError("Failed to load the DeBridge widget script");
//     };

//     document.body.appendChild(script);

//     // Cleanup function
//     return () => {
//       if (widgetInstanceRef.current) {
//         try {
//           widgetInstanceRef.current.disconnect();
//           console.log("DeBridge widget disconnected during cleanup");
//         } catch (error: unknown) {
//           console.error("Error disconnecting widget", error);
//         }
//       }
//     };
//   }, []);

//   // Auto-connect wallet when script is loaded
//   useEffect(() => {
//     if (isScriptLoaded && !isWalletConnected && !initAttempted.current) {
//       // Attempt to connect the wallet
//       connectWallet().catch((error: unknown) => {
//         console.warn("Auto wallet connection failed:", error);
//       });
//     }
//   }, [isScriptLoaded, isWalletConnected]);

//   // Initialize widget when wallet is connected
//   useEffect(() => {
//     // Only proceed if script is loaded and wallet is connected
//     if (!isScriptLoaded || !isWalletConnected || initAttempted.current) {
//       return;
//     }

//     const initializeWidget = async () => {
//       initAttempted.current = true;
//       console.log("Initializing DeBridge widget...");

//       // Give a moment for everything to be ready
//       await new Promise(resolve => setTimeout(resolve, 500));

//       try {
//         // Check which API version is available
//         if (window.deBridge?.Widget) {
//           // Using the original API style
//           console.log("Using DeBridge.Widget.init API");
//           widgetInstanceRef.current = window.deBridge.Widget.init({
//             parentId,
//             config: {
//               defaultFrom,
//               defaultTo,
//               defaultFromChain,
//               defaultToChain,
//               amount,
//               fee: 0,
//             },
//           });
//         } else if (window.deBridge?.widget) {
//           // Using the newer widget API
//           console.log("Using deBridge.widget API");
//           window.deBridge.widget({
//             v: "1",
//             element: parentId,
//             title: "Cross-Chain Swap",
//             description: "Swap tokens across chains",
//             width: "100%",
//             height: height,
//             supportedChains: '{"inputChains":{"1":"all","10":"all","56":"all","100":"all","137":"all","1088":"all","1890":"all","7171":"all","8453":"all","42161":"all","43114":"all","59144":"all","7565164":"all","245022934":"all"},"outputChains":{"1":"all","10":"all","56":"all","100":"all","137":"all","1088":"all","1890":"all","7171":"all","8453":"all","42161":"all","43114":"all","59144":"all","7565164":"all","245022934":"all"}}',
//             inputChain: defaultFromChain === "ethereum" ? 1 : 56,
//             outputChain: defaultToChain === "bsc" ? 56 : 1,
//             inputCurrency: defaultFrom,
//             outputCurrency: defaultTo,
//             address: "",
//             showSwapTransfer: true,
//             amount: amount.toString(),
//             isAmountFromNotModifiable: false,
//             lang: "en",
//             mode: "deswap",
//             isEnableCalldata: false,
//             theme: "dark",
//             isHideLogo: false,
//           });
//         } else {
//           throw new Error("DeBridge API not available in window object");
//         }

//         console.log("DeBridge widget initialized successfully");
//       } catch (error: unknown) {
//         const err = error instanceof Error ? error : new Error(String(error));
//         console.error("Widget initialization error:", err);
//         setError(`Failed to initialize widget: ${err.message || "Unknown error"}`);
//         initAttempted.current = false;
//       }
//     };

//     // Initialize the widget and catch any errors
//     initializeWidget().catch((error: unknown) => {
//       const err = error instanceof Error ? error : new Error(String(error));
//       console.error("Widget initialization promise error:", err);
//       setError(`Widget initialization failed: ${err.message || "Unknown error"}`);
//       initAttempted.current = false;
//     });
//   }, [isScriptLoaded, isWalletConnected, defaultFrom, defaultTo, defaultFromChain, defaultToChain, amount, height]);

//   // Add wallet event listeners
//   useEffect(() => {
//     if (!window.ethereum) return;
    
//     const handleAccountsChanged = (accounts: string[]) => {
//       if (accounts.length === 0) {
//         console.log("Wallet disconnected");
//         setIsWalletConnected(false);
//         initAttempted.current = false;
//       } else {
//         console.log("Accounts changed:", accounts[0]);
//         setIsWalletConnected(true);
//       }
//     };
    
//     const handleChainChanged = () => {
//       console.log("Chain changed, reloading page");
//       window.location.reload();
//     };
    
//     window.ethereum.on('accountsChanged', handleAccountsChanged);
//     window.ethereum.on('chainChanged', handleChainChanged);
    
//     // Check if already connected
//     window.ethereum.request({ method: 'eth_accounts' })
//       .then((accounts: string[]) => {
//         if (accounts && accounts.length > 0) {
//           console.log("Wallet already connected:", accounts[0]);
//           setIsWalletConnected(true);
//         }
//       })
//       .catch((error: unknown) => {
//         console.warn("Error checking wallet accounts:", error);
//       });
    
//     return () => {
//       window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
//       window.ethereum.removeListener('chainChanged', handleChainChanged);
//     };
//   }, []);

//   const handleRetry = () => {
//     setError(null);
//     initAttempted.current = false;
//     connectWallet();
//   };

//   if (error) {
//     return (
//       <div className="text-red-500 p-4 border border-red-200 rounded">
//         <p className="mb-2">{error}</p>
//         <button onClick={handleRetry} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <>
//       {!isScriptLoaded && (
//         <div className="flex justify-center items-center h-[500px]">
//           <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
//         </div>
//       )}
      
//       {isScriptLoaded && !isWalletConnected && (
//         <div className="flex flex-col items-center justify-center h-[500px] border border-gray-300">
//           <p className="mb-4">Wallet connection required to use DeBridge</p>
//           <button 
//             onClick={connectWallet} 
//             className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
//           >
//             Connect Wallet
//           </button>
//         </div>
//       )}
      
//       <div 
//         ref={widgetRef} 
//         id={parentId} 
//         className={`${className} ${!isWalletConnected ? 'hidden' : ''}`}
//         style={{ height: height }}
//       />
//     </>
//   );
// };

// export default DeBridgeWidgetComponent;


//====================================================


"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    ethereum?: any;
    deBridge?: {
      widget?: (config: any) => void;
      Widget?: {
        init: (config: { parentId: string; config: object }) => {
          disconnect: () => void;
        };
      };
    };
    Zone?: any; // Add Zone type for patching
  }
}

interface DeBridgeWidgetProps {
  defaultFrom?: string;
  defaultTo?: string;
  defaultFromChain?: string;
  defaultToChain?: string;
  amount?: number;
  className?: string;
  height?: string;
  theme?: "light" | "dark"; // Allow theme override
  customStyles?: string; // For advanced styling
}

const DeBridgeWidgetComponent: React.FC<DeBridgeWidgetProps> = ({
  defaultFrom = "ETH",
  defaultTo = "USDT",
  defaultFromChain = "ethereum",
  defaultToChain = "bsc",
  amount = 0.01,
  className = "",
  height = "500px",
  theme = "dark",
  customStyles = "" // Default to empty string
}) => {
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetInstanceRef = useRef<{ disconnect: () => void } | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const parentId = "debridge-widget-container";
  const initAttempted = useRef(false);
  const zonePatchApplied = useRef(false);

  // Create emerald theme styles based on the login page
  const emeraldThemeStyles = customStyles || btoa(JSON.stringify({
    colors: {
      primary: "#10b981", // emerald-500
      secondary: "#047857", // emerald-700
      accent: "#34d399", // emerald-400
      background: "rgba(39, 39, 42, 0.4)", // zinc-800 with transparency
      backgroundSecondary: "#18181b", // zinc-900
      text: "#ffffff", // white text
      textSecondary: "#a1a1aa", // zinc-400
      border: "rgba(63, 63, 70, 0.5)" // zinc-700 with transparency
    },
    borderRadius: "0.75rem", // rounded-xl
    buttonPadding: {
      top: "0.5rem",
      right: "1rem",
      bottom: "0.5rem",
      left: "1rem"
    },
    shadows: {
      main: "0 10px 15px -3px rgba(16, 185, 129, 0.1), 0 4px 6px -4px rgba(16, 185, 129, 0.1)" // emerald shadow
    },
    gradients: {
      button: "linear-gradient(to right, #10b981, #34d399)" // emerald gradient
    }
  }));

  // Add Zone.js error patch - this fixes the unhandled rejection errors
  useEffect(() => {
    if (zonePatchApplied.current) return;

    // Create a script element for our patch
    const patchScript = document.createElement('script');
    patchScript.id = 'zone-patch-script';
    patchScript.innerHTML = `
      (function() {
        // This function runs immediately and patches the Zone.js error handling
        const originalOnUnhandledError = window.Zone && 
          window.Zone.__load_patch && 
          window.Zone.__load_patch.r && 
          window.Zone.__load_patch.r.onUnhandledError;
        
        if (originalOnUnhandledError) {
          // Replace the error handler to suppress unhandled rejection errors
          window.Zone.__load_patch.r.onUnhandledError = function(e) {
            // Check if this is from deBridge widget
            if (e && e.rejection && 
                ((e.rejection.code === 4100) || 
                 (e.stack && e.stack.includes('debridge')) || 
                 (e.message && e.message.includes('eth_requestAccounts')))) {
              // Suppress the error by doing nothing
              console.log('Suppressed DeBridge error:', e.rejection || e);
              return;
            }
            
            // For all other errors, use the original handler
            return originalOnUnhandledError.apply(this, arguments);
          };
          console.log('Zone.js error handler patched successfully');
        }
      })();
    `;

    // Add the patch script to the document
    document.head.appendChild(patchScript);
    zonePatchApplied.current = true;

    return () => {
      // Remove the patch script on cleanup
      const script = document.getElementById('zone-patch-script');
      if (script) script.remove();
    };
  }, []);

  // Connect wallet function
  const connectWallet = async () => {
    if (!window.ethereum) {
      setError("No Ethereum provider found. Please install MetaMask or another wallet provider.");
      return false;
    }

    try {
      console.log("Requesting wallet connection...");
      // Add a timeout to the wallet request to prevent hanging
      const accounts = await Promise.race([
        window.ethereum.request({ method: "eth_requestAccounts" }),
        new Promise<null>((_, reject) => 
          setTimeout(() => reject(new Error("Wallet connection timed out")), 30000)
        )
      ]);
      
      if (accounts && Array.isArray(accounts) && accounts.length > 0) {
        console.log("Wallet connected successfully:", accounts[0]);
        setIsWalletConnected(true);
        return true;
      } else {
        setError("No accounts found after connecting wallet.");
        return false;
      }
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      
      // Don't treat user rejection as an error
      if ('code' in err && (err as any).code === 4001) {
        console.log("User rejected wallet connection");
        return false;
      }
      
      console.error("Wallet connection error:", err);
      setError(`Failed to connect wallet: ${err.message || "Unknown error"}`);
      return false;
    }
  };

  // Load the DeBridge script
  useEffect(() => {
    const scriptId = "debridge-widget-script";

    // Check if script is already loaded
    if (typeof window.deBridge !== "undefined") {
      console.log("DeBridge is already available in window object");
      setIsScriptLoaded(true);
      return;
    }

    if (document.getElementById(scriptId)) {
      console.log("DeBridge script tag already exists in DOM");
      return;
    }

    console.log("Loading DeBridge script...");
    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://app.debridge.finance/assets/scripts/widget.js";
    script.async = true;

    script.onload = () => {
      console.log("DeBridge script loaded successfully");
      // Add a small delay to ensure script initialization
      setTimeout(() => {
        setIsScriptLoaded(true);
      }, 500);
    };

    script.onerror = (e) => {
      console.error("Error loading DeBridge script:", e);
      setError("Failed to load the DeBridge widget script");
    };

    document.body.appendChild(script);

    // Cleanup function
    return () => {
      if (widgetInstanceRef.current) {
        try {
          widgetInstanceRef.current.disconnect();
          console.log("DeBridge widget disconnected during cleanup");
        } catch (error: unknown) {
          console.error("Error disconnecting widget", error);
        }
      }
    };
  }, []);

  // Auto-connect wallet when script is loaded
  useEffect(() => {
    if (isScriptLoaded && !isWalletConnected && !initAttempted.current) {
      // Attempt to connect the wallet
      connectWallet().catch((error: unknown) => {
        console.warn("Auto wallet connection failed:", error);
      });
    }
  }, [isScriptLoaded, isWalletConnected]);

  // Initialize widget when wallet is connected
  useEffect(() => {
    // Only proceed if script is loaded and wallet is connected
    if (!isScriptLoaded || !isWalletConnected || initAttempted.current) {
      return;
    }

    const initializeWidget = async () => {
      initAttempted.current = true;
      console.log("Initializing DeBridge widget...");

      // Give a moment for everything to be ready
      await new Promise(resolve => setTimeout(resolve, 500));

      try {
        // Check which API version is available
        if (window.deBridge?.Widget) {
          // Using the original API style
          console.log("Using DeBridge.Widget.init API");
          widgetInstanceRef.current = window.deBridge.Widget.init({
            parentId,
            config: {
              defaultFrom,
              defaultTo,
              defaultFromChain,
              defaultToChain,
              amount,
              fee: 0,
              theme,
              styles: emeraldThemeStyles
            },
          });
        } else if (window.deBridge?.widget) {
          // Using the newer widget API
          console.log("Using deBridge.widget API");
          window.deBridge.widget({
            v: "1",
            element: parentId,
            title: "Cross-Chain Swap",
            description: "Swap tokens across chains",
            width: "100%",
            height: height,
            supportedChains: '{"inputChains":{"1":"all","10":"all","56":"all","100":"all","137":"all","1088":"all","1890":"all","7171":"all","8453":"all","42161":"all","43114":"all","59144":"all","7565164":"all","245022934":"all"},"outputChains":{"1":"all","10":"all","56":"all","100":"all","137":"all","1088":"all","1890":"all","7171":"all","8453":"all","42161":"all","43114":"all","59144":"all","7565164":"all","245022934":"all"}}',
            inputChain: defaultFromChain === "ethereum" ? 1 : 56,
            outputChain: defaultToChain === "bsc" ? 56 : 1,
            inputCurrency: defaultFrom,
            outputCurrency: defaultTo,
            address: "",
            showSwapTransfer: true,
            amount: amount.toString(),
            isAmountFromNotModifiable: false,
            lang: "en",
            mode: "deswap",
            isEnableCalldata: false,
            theme: theme,
            isHideLogo: false,
            styles: emeraldThemeStyles
          });
        } else {
          throw new Error("DeBridge API not available in window object");
        }

        console.log("DeBridge widget initialized successfully");
      } catch (error: unknown) {
        const err = error instanceof Error ? error : new Error(String(error));
        console.error("Widget initialization error:", err);
        setError(`Failed to initialize widget: ${err.message || "Unknown error"}`);
        initAttempted.current = false;
      }
    };

    // Initialize the widget and catch any errors
    initializeWidget().catch((error: unknown) => {
      const err = error instanceof Error ? error : new Error(String(error));
      console.error("Widget initialization promise error:", err);
      setError(`Widget initialization failed: ${err.message || "Unknown error"}`);
      initAttempted.current = false;
    });
  }, [isScriptLoaded, isWalletConnected, defaultFrom, defaultTo, defaultFromChain, defaultToChain, amount, height, theme, emeraldThemeStyles]);

  // Add wallet event listeners
  useEffect(() => {
    if (!window.ethereum) return;
    
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        console.log("Wallet disconnected");
        setIsWalletConnected(false);
        initAttempted.current = false;
      } else {
        console.log("Accounts changed:", accounts[0]);
        setIsWalletConnected(true);
      }
    };
    
    const handleChainChanged = () => {
      console.log("Chain changed, reloading page");
      window.location.reload();
    };
    
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);
    
    // Check if already connected
    window.ethereum.request({ method: 'eth_accounts' })
      .then((accounts: string[]) => {
        if (accounts && accounts.length > 0) {
          console.log("Wallet already connected:", accounts[0]);
          setIsWalletConnected(true);
        }
      })
      .catch((error: unknown) => {
        console.warn("Error checking wallet accounts:", error);
      });
    
    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, []);

  const handleRetry = () => {
    setError(null);
    initAttempted.current = false;
    connectWallet();
  };

  if (error) {
    return (
      <div className="text-red-500 p-4 border border-emerald-800/50 rounded-xl bg-zinc-900/90 backdrop-blur-sm">
        <p className="mb-2">{error}</p>
        <button onClick={handleRetry} className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-4 py-2 rounded-lg hover:from-emerald-500 hover:to-emerald-400 transition-all duration-300">
          Retry
        </button>
      </div>
    );
  }

  // Apply emerald styling to loading and connection UI
  return (
    <>
      {!isScriptLoaded && (
        <div className="flex justify-center items-center h-[500px] bg-zinc-900/50 rounded-xl backdrop-blur-md border border-zinc-800/50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      )}
      
      {isScriptLoaded && !isWalletConnected && (
        <div className="flex flex-col items-center justify-center h-[500px] bg-zinc-800/40 rounded-xl backdrop-blur-md border border-zinc-700/50 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600/20 via-emerald-500/5 to-emerald-600/20 rounded-xl blur-xl opacity-50 -z-10"></div>
          
          <p className="mb-4 text-white">Wallet connection required to use DeBridge</p>
          <button 
            onClick={connectWallet} 
            className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-6 py-3 rounded-lg hover:from-emerald-500 hover:to-emerald-400 transition-all duration-300 shadow-lg shadow-emerald-500/20"
          >
            Connect Wallet
          </button>
        </div>
      )}
      
      <div 
        ref={widgetRef} 
        id={parentId} 
        className={`${className} ${!isWalletConnected ? 'hidden' : ''} bg-zinc-900/30 backdrop-blur-md rounded-xl border border-zinc-800/50 shadow-lg shadow-emerald-500/5 overflow-hidden`}
        style={{ height: height }}
      />
      
      {/* Add CSS animations similar to login page */}
      <style jsx global>{`
        @keyframes gradient-x {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .animate-gradient-x {
          background-size: 200% 100%;
          animation: gradient-x 15s ease infinite;
        }
      `}</style>
    </>
  );
};

export default DeBridgeWidgetComponent;