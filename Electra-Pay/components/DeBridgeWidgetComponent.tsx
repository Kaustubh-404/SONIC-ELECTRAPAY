

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