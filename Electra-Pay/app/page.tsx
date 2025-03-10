// import Link from 'next/link';
// import { ArrowRight, Wallet, Clock, LineChart, Shield, Boxes, Coins } from 'lucide-react';

// export default function Home() {
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
//       {/* Header/Navigation */}
//       <header className="fixed top-0 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl z-50">
//         <div className="container mx-auto px-4 h-16 flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <Coins className="size-6 text-emerald-500" />
//             <span className="text-2xl font-bold">ElectraPay</span>
//           </div>
//           <nav className="hidden md:flex items-center gap-8">
//             <Link href="#features" className="text-sm text-zinc-400 hover:text-white transition-colors">Features</Link>
//             <Link href="#how-it-works" className="text-sm text-zinc-400 hover:text-white transition-colors">How it Works</Link>
//             <Link href="#security" className="text-sm text-zinc-400 hover:text-white transition-colors">Security</Link>
//             <Link href="#faq" className="text-sm text-zinc-400 hover:text-white transition-colors">FAQ</Link>
//           </nav>
//         </div>
//       </header>

//       {/* Hero Section */}
//       <section className="pt-32 pb-20">
//         <div className="container mx-auto px-4 text-center">
//           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-8">
//             <span className="size-2 rounded-full bg-emerald-500"></span>
//             <span className="text-sm">Powered by ElectroneumTestnet</span>
//           </div>
//           <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
//             Revolutionize Your Recurring Payments with Blockchain
//           </h1>
//           <p className="text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto mb-12">
//             ElectraPay is a decentralized platform that automates and secures your recurring payments using smart contracts on the ElectroneumTestnet. Perfect for organizations managing employee payments.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <Link
//               href="/auth/organization"
//               className="inline-flex items-center justify-center gap-2 bg-emerald-500 text-black px-8 py-3 rounded-lg font-medium hover:bg-emerald-400 transition-colors group"
//             >
//               Organization Login
//               <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
//             </Link>
//             <Link
//               href="/auth/employee"
//               className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-medium border border-white/10 hover:bg-white/5 transition-colors"
//             >
//               Employee Login
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* Features Grid */}
//       <section id="features" className="py-20 border-t border-white/10">
//         <div className="container mx-auto px-4">
//           <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
//           <div className="grid md:grid-cols-3 gap-8">
//             <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
//               <Clock className="size-8 mb-4 text-emerald-500" />
//               <h3 className="text-xl font-semibold mb-2">Automated Payments</h3>
//               <p className="text-zinc-400">Set up recurring payments with smart contracts that execute automatically and reliably.</p>
//             </div>
//             <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
//               <LineChart className="size-8 mb-4 text-emerald-500" />
//               <h3 className="text-xl font-semibold mb-2">Real-time Tracking</h3>
//               <p className="text-zinc-400">Monitor payment status and history with real-time updates and detailed analytics.</p>
//             </div>
//             <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
//               <Wallet className="size-8 mb-4 text-emerald-500" />
//               <h3 className="text-xl font-semibold mb-2">RainbowKit Integration</h3>
//               <p className="text-zinc-400">Seamless wallet connection and management with built-in RainbowKit support.</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* How It Works */}
//       <section id="how-it-works" className="py-20 border-t border-white/10 bg-white/5">
//         <div className="container mx-auto px-4">
//           <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {[
//               {
//                 step: "1",
//                 title: "Connect Wallet",
//                 description: "Link your wallet using RainbowKit for secure access",
//                 icon: Wallet
//               },
//               {
//                 step: "2",
//                 title: "Setup Payments",
//                 description: "Configure recurring payment details and schedule",
//                 icon: Clock
//               },
//               {
//                 step: "3",
//                 title: "Smart Contract",
//                 description: "Payments are automated via Electroneumsmart contracts",
//                 icon: Boxes
//               },
//               {
//                 step: "4",
//                 title: "Monitor",
//                 description: "Track and manage all payments in real-time",
//                 icon: LineChart
//               }
//             ].map((item, index) => (
//               <div key={index} className="relative p-6 rounded-2xl bg-white/5 border border-white/10">
//                 <div className="absolute -top-3 -left-3 size-6 rounded-full bg-emerald-500 text-black flex items-center justify-center text-sm font-bold">
//                   {item.step}
//                 </div>
//                 <item.icon className="size-8 mb-4 text-emerald-500" />
//                 <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
//                 <p className="text-zinc-400">{item.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Security Section */}
//       <section id="security" className="py-20 border-t border-white/10">
//         <div className="container mx-auto px-4 text-center">
//           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 mb-8">
//             <Shield className="size-4" />
//             <span className="text-sm font-medium">Enterprise-Grade Security</span>
//           </div>
//           <h2 className="text-3xl font-bold mb-6">Secured by Blockchain Technology</h2>
//           <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
//             ElectraPay leverages the power of ElectroneumTestnet and smart contracts to ensure your recurring payments are secure, transparent, and immutable.
//           </p>
//         </div>
//       </section>

//       {/* Network Stats */}
//       <section className="py-20 border-t border-white/10 bg-white/5">
//         <div className="container mx-auto px-4">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//             {[
//               { label: "Total Transactions", value: "1M+" },
//               { label: "Organizations", value: "500+" },
//               { label: "Success Rate", value: "99.9%" },
//               { label: "GAS Processed", value: "100K+" }
//             ].map((stat, index) => (
//               <div key={index} className="text-center">
//                 <div className="text-3xl font-bold mb-2">{stat.value}</div>
//                 <div className="text-sm text-zinc-400">{stat.label}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }




// "use client";

// import Link from 'next/link';
// import { useEffect, useState } from 'react';
// import { ArrowRight, Wallet, Clock, LineChart, Shield, Boxes, Coins } from 'lucide-react';

// export default function Home() {
//   // For the floating particles animation
//   const [mounted, setMounted] = useState(false);
  
//   useEffect(() => {
//     setMounted(true);
    
//     // Clean up on unmount
//     return () => setMounted(false);
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white relative overflow-hidden">
//       {/* Animated Background Elements */}
//       {mounted && (
//         <>
//           {/* Floating particles */}
//           <div className="absolute inset-0 overflow-hidden pointer-events-none">
//             {Array.from({ length: 20 }).map((_, i) => (
//               <div 
//                 key={i}
//                 className="absolute rounded-full bg-emerald-500/20 blur-xl"
//                 style={{
//                   width: `${Math.random() * 300 + 100}px`,
//                   height: `${Math.random() * 300 + 100}px`,
//                   top: `${Math.random() * 100}%`,
//                   left: `${Math.random() * 100}%`,
//                   opacity: Math.random() * 0.3,
//                   animation: `float ${Math.random() * 20 + 20}s linear infinite`,
//                   animationDelay: `${Math.random() * 20}s`,
//                   transform: `translate(-50%, -50%)`
//                 }}
//               />
//             ))}
//           </div>
          
//           {/* Grid overlay */}
//           <div 
//             className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none"
//             style={{
//               backgroundPosition: '0 0, 0 0',
//               opacity: 0.2
//             }}
//           />
          
//           {/* Radial gradient overlay */}
//           <div className="absolute inset-0 bg-gradient-radial from-transparent to-black opacity-70 pointer-events-none" />
//         </>
//       )}

//       {/* Header/Navigation */}
//       <header className="fixed top-0 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl z-50">
//         <div className="container mx-auto px-4 h-16 flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <div className="relative">
//               <Coins className="h-6 w-6 text-emerald-500" />
//               <div className="absolute -inset-1 bg-emerald-500/30 rounded-full blur-sm animate-pulse" style={{ animationDuration: '3s' }}></div>
//             </div>
//             <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-emerald-300">ElectraPay</span>
//           </div>
//           <nav className="hidden md:flex items-center gap-8">
//             <Link href="#features" className="text-sm text-zinc-400 hover:text-white transition-colors hover:scale-105">Features</Link>
//             <Link href="#how-it-works" className="text-sm text-zinc-400 hover:text-white transition-colors hover:scale-105">How it Works</Link>
//             <Link href="#security" className="text-sm text-zinc-400 hover:text-white transition-colors hover:scale-105">Security</Link>
//             <Link href="#faq" className="text-sm text-zinc-400 hover:text-white transition-colors hover:scale-105">FAQ</Link>
//           </nav>
//         </div>
//       </header>

//       {/* Hero Section */}
//       <section className="pt-32 pb-20 relative">
//         <div className="container mx-auto px-4 text-center relative z-10">
//           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-8 backdrop-blur-md hover:border-emerald-500/30 transition-colors">
//             <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" style={{ animationDuration: '2s' }}></span>
//             <span className="text-sm">Powered by Electroneum </span>
//           </div>
//           <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-emerald-200 to-white/60 bg-clip-text text-transparent animate-gradient-x">
//             Revolutionize Your Recurring Payments with Blockchain
//           </h1>
//           <p className="text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto mb-12 backdrop-blur-sm">
//             ElectraPay is a decentralized platform that automates and secures your recurring payments using smart contracts on the Electroneum. Perfect for organizations managing employee payments.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <Link
//               href="/auth/organization"
//               className="inline-flex items-center justify-center gap-2 bg-emerald-500 text-black px-8 py-3 rounded-lg font-medium hover:bg-emerald-400 transition-colors group hover:shadow-lg hover:shadow-emerald-500/20 transform hover:-translate-y-1 transition-all"
//             >
//               Organization Login
//               <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
//             </Link>
//             <Link
//               href="/auth/employee"
//               className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-medium border border-white/10 hover:bg-white/5 transition-colors hover:border-emerald-500/50 transform hover:-translate-y-1 transition-all"
//             >
//               Employee Login
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* Features Grid */}
//       <section id="features" className="py-20 border-t border-white/10 relative">
//         <div className="container mx-auto px-4 relative z-10">
//           <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent">Key Features</h2>
//           <div className="grid md:grid-cols-3 gap-8">
//             {[
//               {
//                 icon: Clock,
//                 title: "Automated Payments",
//                 description: "Set up recurring payments with smart contracts that execute automatically and reliably."
//               },
//               {
//                 icon: LineChart,
//                 title: "Real-time Tracking",
//                 description: "Monitor payment status and history with real-time updates and detailed analytics."
//               },
//               {
//                 icon: Wallet,
//                 title: "RainbowKit Integration",
//                 description: "Seamless wallet connection and management with built-in RainbowKit support."
//               }
//             ].map((feature, index) => (
//               <div 
//                 key={index}
//                 className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 group"
//               >
//                 <div className="relative mb-4 inline-block">
//                   <feature.icon className="h-8 w-8 text-emerald-500 relative z-10" />
//                   <div className="absolute -inset-1 rounded-full bg-emerald-500/20 blur-sm transform scale-0 group-hover:scale-100 transition-transform duration-300"></div>
//                 </div>
//                 <h3 className="text-xl font-semibold mb-2 group-hover:text-emerald-300 transition-colors">{feature.title}</h3>
//                 <p className="text-zinc-400">{feature.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* How It Works */}
//       <section id="how-it-works" className="py-20 border-t border-white/10 bg-white/5 relative">
//         <div className="container mx-auto px-4 relative z-10">
//           <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent">How It Works</h2>
//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {[
//               {
//                 step: "1",
//                 title: "Connect Wallet",
//                 description: "Link your wallet using RainbowKit for secure access",
//                 icon: Wallet
//               },
//               {
//                 step: "2",
//                 title: "Setup Payments",
//                 description: "Configure recurring payment details and schedule",
//                 icon: Clock
//               },
//               {
//                 step: "3",
//                 title: "Smart Contract",
//                 description: "Payments are automated via Electroneumsmart contracts",
//                 icon: Boxes
//               },
//               {
//                 step: "4",
//                 title: "Monitor",
//                 description: "Track and manage all payments in real-time",
//                 icon: LineChart
//               }
//             ].map((item, index) => (
//               <div key={index} className="relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-1 backdrop-blur-sm">
//                 <div className="absolute -top-3 -left-3 h-6 w-6 rounded-full bg-emerald-500 text-black flex items-center justify-center text-sm font-bold z-10">
//                   {item.step}
//                 </div>
//                 <div className="absolute -top-3 -left-3 h-6 w-6 rounded-full bg-emerald-400 blur-sm animate-pulse" style={{ animationDuration: '3s' }}></div>
//                 <item.icon className="h-8 w-8 mb-4 text-emerald-500" />
//                 <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
//                 <p className="text-zinc-400">{item.description}</p>
//                 {/* Connection line */}
//                 {index < 3 && (
//                   <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-emerald-500 to-transparent z-0"></div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Security Section */}
//       <section id="security" className="py-20 border-t border-white/10 relative">
//         <div className="container mx-auto px-4 text-center relative z-10">
//           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 mb-8 hover:bg-emerald-500/20 transition-colors">
//             <Shield className="h-4 w-4 animate-pulse" style={{ animationDuration: '4s' }} />
//             <span className="text-sm font-medium">Enterprise-Grade Security</span>
//           </div>
//           <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent">Secured by Blockchain Technology</h2>
//           <p className="text-lg text-zinc-400 max-w-2xl mx-auto backdrop-blur-sm">
//             ElectraPay leverages the power of Electroneum and smart contracts to ensure your recurring payments are secure, transparent, and immutable.
//           </p>
          
//           {/* Added security visual element */}
//           <div className="mt-12 relative max-w-md mx-auto">
//             <div className="w-32 h-32 rounded-full bg-emerald-500/20 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 blur-xl animate-pulse" style={{ animationDuration: '6s' }}></div>
//             <div className="w-48 h-48 rounded-full border border-emerald-500/30 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin" style={{ animationDuration: '15s' }}></div>
//             <div className="w-64 h-64 rounded-full border border-emerald-500/20 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin" style={{ animationDuration: '25s', animationDirection: 'reverse' }}></div>
//             <Shield className="h-16 w-16 text-emerald-500 mx-auto relative" />
//           </div>
//         </div>
//       </section>

//       {/* Network Stats */}
//       <section className="py-20 border-t border-white/10 bg-white/5 relative">
//         <div className="container mx-auto px-4 relative z-10">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//             {[
//               { label: "Total Transactions", value: "1M+" },
//               { label: "Organizations", value: "500+" },
//               { label: "Success Rate", value: "99.9%" },
//               { label: "GAS Processed", value: "100K+" }
//             ].map((stat, index) => (
//               <div key={index} className="text-center transform hover:scale-105 transition-transform p-6 rounded-xl backdrop-blur-sm hover:bg-white/5">
//                 <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent">{stat.value}</div>
//                 <div className="text-sm text-zinc-400">{stat.label}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Add CSS animations */}
//       <style jsx global>{`
//         @keyframes float {
//           0% {
//             transform: translate(-50%, -50%) translateY(0px) rotate(0deg);
//           }
//           50% {
//             transform: translate(-50%, -50%) translateY(-100px) rotate(180deg);
//           }
//           100% {
//             transform: translate(-50%, -50%) translateY(0px) rotate(360deg);
//           }
//         }
        
//         @keyframes gradient-x {
//           0% {
//             background-position: 0% 50%;
//           }
//           50% {
//             background-position: 100% 50%;
//           }
//           100% {
//             background-position: 0% 50%;
//           }
//         }
        
//         .animate-gradient-x {
//           background-size: 200% 100%;
//           animation: gradient-x 15s ease infinite;
//         }
        
//         .bg-gradient-radial {
//           background-image: radial-gradient(circle, var(--tw-gradient-from), var(--tw-gradient-to));
//         }
//       `}</style>
//     </div>
//   );
// }



"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, Wallet, Clock, LineChart, Shield, Boxes, Coins } from 'lucide-react';

export default function Home() {
  // For the floating particles animation
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    // Clean up on unmount
    return () => setMounted(false);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      {mounted && (
        <>
          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 20 }).map((_, i) => (
              <div 
                key={i}
                className="absolute rounded-full bg-emerald-500/20 blur-xl"
                style={{
                  width: `${Math.random() * 300 + 100}px`,
                  height: `${Math.random() * 300 + 100}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.3,
                  animation: `float ${Math.random() * 20 + 20}s linear infinite`,
                  animationDelay: `${Math.random() * 20}s`,
                  transform: `translate(-50%, -50%)`
                }}
              />
            ))}
          </div>
          
          {/* Additional focused floating elements in the hero section */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Specifically positioned elements behind the hero title */}
            <div 
              className="absolute rounded-full bg-emerald-600/30 blur-xl"
              style={{
                width: '400px',
                height: '400px',
                top: '40%',
                left: '30%',
                opacity: 0.25,
                animation: 'float 25s linear infinite',
                transform: 'translate(-50%, -50%)'
              }}
            />
            <div 
              className="absolute rounded-full bg-emerald-500/20 blur-xl"
              style={{
                width: '300px',
                height: '300px',
                top: '35%',
                left: '70%',
                opacity: 0.3,
                animation: 'float 30s linear infinite reverse',
                animationDelay: '5s',
                transform: 'translate(-50%, -50%)'
              }}
            />
            <div 
              className="absolute rounded-full bg-emerald-700/25 blur-xl"
              style={{
                width: '250px',
                height: '250px',
                top: '50%',
                left: '50%',
                opacity: 0.2,
                animation: 'pulseAndFloat 20s ease-in-out infinite',
                transform: 'translate(-50%, -50%)'
              }}
            />
            
            {/* Smaller accent elements */}
            <div 
              className="absolute rounded-full bg-emerald-400/30 blur-md"
              style={{
                width: '100px',
                height: '100px',
                top: '42%',
                left: '25%',
                opacity: 0.4,
                animation: 'pulse 8s ease-in-out infinite',
                transform: 'translate(-50%, -50%)'
              }}
            />
            <div 
              className="absolute rounded-full bg-emerald-300/20 blur-md"
              style={{
                width: '80px',
                height: '80px',
                top: '38%',
                left: '80%',
                opacity: 0.3,
                animation: 'pulse 6s ease-in-out infinite',
                animationDelay: '2s',
                transform: 'translate(-50%, -50%)'
              }}
            />
          </div>
          
          {/* Grid overlay */}
          <div 
            className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none"
            style={{
              backgroundPosition: '0 0, 0 0',
              opacity: 0.2
            }}
          />
          
          {/* Radial gradient overlay */}
          <div className="absolute inset-0 bg-gradient-radial from-transparent to-black opacity-70 pointer-events-none" />
        </>
      )}

      {/* Header/Navigation */}
      <header className="fixed top-0 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Coins className="h-6 w-6 text-emerald-500" />
              <div className="absolute -inset-1 bg-emerald-500/30 rounded-full blur-sm animate-pulse" style={{ animationDuration: '3s' }}></div>
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-emerald-300">ElectraPay</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-zinc-400 hover:text-white transition-colors hover:scale-105">Features</Link>
            <Link href="#how-it-works" className="text-sm text-zinc-400 hover:text-white transition-colors hover:scale-105">How it Works</Link>
            <Link href="#security" className="text-sm text-zinc-400 hover:text-white transition-colors hover:scale-105">Security</Link>
            <Link href="#faq" className="text-sm text-zinc-400 hover:text-white transition-colors hover:scale-105">FAQ</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative">
        {/* Additional hero-specific glow effect */}
        <div className="absolute left-1/2 top-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-8 backdrop-blur-md hover:border-emerald-500/30 transition-colors">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse " style={{ animationDuration: '2s' }}></span>
            <span className="text-sm">Powered by Electroneum</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-emerald-200 to-white/60 bg-clip-text text-transparent animate-gradient-x relative z-20">
            Revolutionize Your Recurring Payments with Blockchain
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto mb-12 backdrop-blur-sm">
            ElectraPay is a decentralized platform that automates and secures your recurring payments using smart contracts on the Electroneum. Perfect for organizations managing employee payments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/organization"
              className="inline-flex items-center justify-center gap-2 bg-emerald-500 text-black px-8 py-3 rounded-lg font-medium hover:bg-emerald-400 transition-colors group hover:shadow-lg hover:shadow-emerald-500/20 transform hover:-translate-y-1 transition-all"
            >
              Organization Login
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/auth/employee"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-medium border border-white/10 hover:bg-white/5 transition-colors hover:border-emerald-500/50 transform hover:-translate-y-1 transition-all"
            >
              Employee Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 border-t border-white/10 relative">
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                title: "Automated Payments",
                description: "Set up recurring payments with smart contracts that execute automatically and reliably."
              },
              {
                icon: LineChart,
                title: "Real-time Tracking",
                description: "Monitor payment status and history with real-time updates and detailed analytics."
              },
              {
                icon: Wallet,
                title: "RainbowKit Integration",
                description: "Seamless wallet connection and management with built-in RainbowKit support."
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 group"
              >
                <div className="relative mb-4 inline-block">
                  <feature.icon className="h-8 w-8 text-emerald-500 relative z-10" />
                  <div className="absolute -inset-1 rounded-full bg-emerald-500/20 blur-sm transform scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-emerald-300 transition-colors">{feature.title}</h3>
                <p className="text-zinc-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 border-t border-white/10 bg-white/5 relative">
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent">How It Works</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Connect Wallet",
                description: "Link your wallet using RainbowKit for secure access",
                icon: Wallet
              },
              {
                step: "2",
                title: "Setup Payments",
                description: "Configure recurring payment details and schedule",
                icon: Clock
              },
              {
                step: "3",
                title: "Smart Contract",
                description: "Payments are automated via Electroneumsmart contracts",
                icon: Boxes
              },
              {
                step: "4",
                title: "Monitor",
                description: "Track and manage all payments in real-time",
                icon: LineChart
              }
            ].map((item, index) => (
              <div key={index} className="relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-1 backdrop-blur-sm">
                <div className="absolute -top-3 -left-3 h-6 w-6 rounded-full bg-emerald-500 text-black flex items-center justify-center text-sm font-bold z-10">
                  {item.step}
                </div>
                <div className="absolute -top-3 -left-3 h-6 w-6 rounded-full bg-emerald-400 blur-sm animate-pulse" style={{ animationDuration: '3s' }}></div>
                <item.icon className="h-8 w-8 mb-4 text-emerald-500" />
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-zinc-400">{item.description}</p>
                {/* Connection line */}
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-emerald-500 to-transparent z-0"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-20 border-t border-white/10 relative">
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 mb-8 hover:bg-emerald-500/20 transition-colors">
            <Shield className="h-4 w-4 animate-pulse" style={{ animationDuration: '4s' }} />
            <span className="text-sm font-medium">Enterprise-Grade Security</span>
          </div>
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent">Secured by Blockchain Technology</h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto backdrop-blur-sm">
            ElectraPay leverages the power of Electroneum and smart contracts to ensure your recurring payments are secure, transparent, and immutable.
          </p>
          
          {/* Added security visual element */}
          <div className="mt-12 relative max-w-md mx-auto">
            <div className="w-32 h-32 rounded-full bg-emerald-500/20 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 blur-xl animate-pulse" style={{ animationDuration: '6s' }}></div>
            <div className="w-48 h-48 rounded-full border border-emerald-500/30 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin" style={{ animationDuration: '15s' }}></div>
            <div className="w-64 h-64 rounded-full border border-emerald-500/20 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin" style={{ animationDuration: '25s', animationDirection: 'reverse' }}></div>
            <Shield className="h-16 w-16 text-emerald-500 mx-auto relative" />
          </div>
        </div>
      </section>

      {/* Network Stats */}
      <section className="py-20 border-t border-white/10 bg-white/5 relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Total Transactions", value: "1M+" },
              { label: "Organizations", value: "500+" },
              { label: "Success Rate", value: "99.9%" },
              { label: "GAS Processed", value: "100K+" }
            ].map((stat, index) => (
              <div key={index} className="text-center transform hover:scale-105 transition-transform p-6 rounded-xl backdrop-blur-sm hover:bg-white/5">
                <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent">{stat.value}</div>
                <div className="text-sm text-zinc-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add CSS animations */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translate(-50%, -50%) translateY(0px) rotate(0deg);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-100px) rotate(180deg);
          }
          100% {
            transform: translate(-50%, -50%) translateY(0px) rotate(360deg);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0.5;
          }
        }
        
        @keyframes pulseAndFloat {
          0% {
            transform: translate(-50%, -50%) translateY(0px) scale(1);
            opacity: 0.2;
          }
          25% {
            transform: translate(-50%, -50%) translateY(-50px) scale(1.3);
            opacity: 0.4;
          }
          50% {
            transform: translate(-50%, -50%) translateY(-70px) scale(1.1);
            opacity: 0.3;
          }
          75% {
            transform: translate(-50%, -50%) translateY(-30px) scale(1.2);
            opacity: 0.25;
          }
          100% {
            transform: translate(-50%, -50%) translateY(0px) scale(1);
            opacity: 0.2;
          }
        }
        
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
        
        .bg-gradient-radial {
          background-image: radial-gradient(circle, var(--tw-gradient-from), var(--tw-gradient-to));
        }
      `}</style>
    </div>
  );
}