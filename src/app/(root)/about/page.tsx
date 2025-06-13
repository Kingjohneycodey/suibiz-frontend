import { Footer } from "@/components/landing-page/Footer";
import Image from "next/image";
import { Header } from "@/components/landing-page/Header";
import Link from "next/link";


const AboutSection = () => {
    return (
        <>
            <Header />
            <div className="bg-white text-gray-900 min-h-screen overflow-x-hidden">
                <div className="relative overflow-hidden bg-gradient-to-br from-white to-blue-50">
                    <div className="absolute top-0 left-0 w-full h-full opacity-5">
                        <div className="absolute top-20 left-10 w-64 h-64 bg-[#6FBCF0] rounded-full filter blur-3xl opacity-20"></div>
                        <div className="absolute bottom-10 right-20 w-80 h-80 bg-purple-500 rounded-full filter blur-3xl opacity-15"></div>
                    </div>
                    
                    <div className="relative max-w-7xl mx-auto px-4 py-32 sm:px-6 lg:px-8 z-10">
                        <div className="text-center">
                            <div className="flex flex-col items-center mb-8">
                                <div className="relative">
                                    <Image
                                        src="/sui-logo.png" 
                                        alt="Sui Logo" 
                                        width={120}
                                        height={120}
                                        className="h-24 w-24 animate-float"
                                    />
                                    <div className="absolute -inset-4 rounded-full border-2 border-sui-blue/30 animate-pulse"></div>
                                </div>
                                <h1 className="mt-6 text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-sui-blue sm:text-6xl lg:text-7xl tracking-tight">
                                    Sui<span className="text-sui-blue">Biz</span>
                                </h1>
                            </div>
                            <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-600 font-medium">
                                The next-generation decentralized commerce protocol on Sui blockchain
                            </p>
                            <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
                                <Link href={'/services'}>
                                    <button className="px-8 py-4 bg-transparent border-2 border-sui-blue/80 text-sui-blue rounded-xl font-medium text-lg hover:bg-[#6FBCF0]/5 transition-all shadow-sm hover:shadow-md">
                                        View Services
                                    </button>
                                </Link>
                                <Link href={'/marketplace'}>
                                    <button className="relative px-8 py-4  bg-[#6FBCF0] hover:bg-[#6FBCF0]-dark rounded-xl font-medium text-lg text-white transition-all duration-300 shadow-lg hover:shadow-xl group">
                                        <span className="relative z-10">Explore MarketPlace</span>
                                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-sui-blue to-sui-blue-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative py-16 -mt-12 z-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { value: "12.5K+", label: "Active Users" },
                                { value: "45.2K+", label: "Transactions" },
                                { value: "$2.8M+", label: "Total Volume" },
                                { value: "89+", label: "Countries" }
                            ].map((stat, index) => (
                                <div 
                                    key={index}
                                    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300 hover:-translate-y-1"
                                >
                                    <div className="text-4xl font-bold text-sui-blue mb-2">{stat.value}</div>
                                    <div className="text-gray-500 font-medium">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="relative py-28 bg-white overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden opacity-5">
                        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#6FBCF0] rounded-full filter blur-3xl opacity-10"></div>
                        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-purple-500 rounded-full filter blur-3xl opacity-10"></div>
                    </div>
                    
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div className="space-y-8">
                                <h2 className="text-4xl font-bold tracking-tight">
                                    Redefining <span className="text-sui-blue">Commerce</span> in Web3
                                </h2>
                                <p className="text-xl text-gray-600 leading-relaxed">
                                    SuiBiz is building a permissionless commerce layer where users have true ownership, 
                                    transactions are trustless, and reputation is portable across the decentralized web.
                                </p>
                                
                                <div className="space-y-6">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 mt-1 mr-4">
                                            <div className="w-10 h-10 bg-[#6FBCF0]/10 rounded-full flex items-center justify-center">
                                                <svg className="w-5 h-5 text-sui-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                </svg>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold">Decentralized Commerce</h3>
                                            <p className="text-gray-600 mt-1">
                                                Peer-to-peer transactions without intermediaries, secured by Sui's high-performance blockchain.
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 mt-1 mr-4">
                                            <div className="w-10 h-10 bg-[#6FBCF0]/10 rounded-full flex items-center justify-center">
                                                <svg className="w-5 h-5 text-sui-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                </svg>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold">User Sovereignty</h3>
                                            <p className="text-gray-600 mt-1">
                                                Your data, reputation, and assets remain in your control, secured in your wallet.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="relative">
                                <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-w-16 aspect-h-9">
                                    <div className="absolute inset-0 bg-gradient-to-br from-sui-blue/20 to-white/50"></div>
                                    <Image
                                        src="/about-image.webp"
                                        alt="Decentralized commerce"
                                        width={800}
                                        height={500}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-lg border border-gray-100 w-64">
                                    <div className="text-sui-blue text-3xl mb-2">⚡</div>
                                    <h4 className="font-bold">Instant Settlement</h4>
                                    <p className="text-sm text-gray-600 mt-1">Sub-second finality with Sui's blockchain</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="py-28 bg-gradient-to-b from-white to-blue-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-20">
                            <h2 className="text-4xl font-bold tracking-tight mb-6">
                                The Future of <span className="text-sui-blue">Commerce</span> is Here
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Built with cutting-edge blockchain technology for seamless decentralized commerce
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                {
                                    title: "Smart Contract Escrow",
                                    description: "Funds held securely in smart contracts until both parties fulfill their obligations.",
                                    icon: (
                                        <svg className="w-8 h-8 text-sui-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                    ),
                                    color: "bg-blue-50"
                                },
                                {
                                    title: "NFT Reputation",
                                    description: "Immutable, transferable reputation as NFTs that you own and control.",
                                    icon: (
                                        <svg className="w-8 h-8 text-sui-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path>
                                        </svg>
                                    ),
                                    color: "bg-purple-50"
                                },
                                {
                                    title: "Near-Zero Fees",
                                    description: "Sui's efficient blockchain minimizes transaction costs for users.",
                                    icon: (
                                        <svg className="w-8 h-8 text-sui-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                                        </svg>
                                    ),
                                    color: "bg-green-50"
                                },
                                {
                                    title: "Instant Settlement",
                                    description: "Sui's sub-second finality means no waiting for transaction confirmation.",
                                    icon: (
                                        <svg className="w-8 h-8 text-sui-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                    ),
                                    color: "bg-yellow-50"
                                },
                                {
                                    title: "DAO Governance",
                                    description: "Community-owned protocol with decentralized decision making.",
                                    icon: (
                                        <svg className="w-8 h-8 text-sui-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                        </svg>
                                    ),
                                    color: "bg-red-50"
                                },
                                {
                                    title: "Cross-Chain Future",
                                    description: "Designed for interoperability with the broader Web3 ecosystem.",
                                    icon: (
                                        <svg className="w-8 h-8 text-sui-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                                        </svg>
                                    ),
                                    color: "bg-indigo-50"
                                }
                            ].map((feature, index) => (
                                <div 
                                    key={index}
                                    className={`relative p-8 rounded-2xl border border-gray-100 ${feature.color} transition-all duration-300 hover:shadow-lg hover:border-sui-blue/30 overflow-hidden`}
                                >
                                    <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 bg-[#6FBCF0]"></div>
                                    <div className="relative z-10">
                                        <div className="w-14 h-14 rounded-xl bg-white shadow-sm flex items-center justify-center mb-6">
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                        <p className="text-gray-600">{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="py-28 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-20">
                            <h2 className="text-4xl font-bold tracking-tight mb-6">
                                Powered by <span className="text-sui-blue">Sui Blockchain</span>
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Leveraging the most advanced blockchain technology for decentralized commerce
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    title: "Horizontal Scalability",
                                    description: "Sui's unique architecture allows linear scaling with network growth, ensuring SuiBiz remains fast and low-cost as adoption increases.",
                                    icon: "📈",
                                    highlight: "bg-gradient-to-r from-blue-100 to-blue-50"
                                },
                                {
                                    title: "Move Language",
                                    description: "Built with Move, a secure smart contract language designed for digital assets and financial applications.",
                                    icon: "🛡️",
                                    highlight: "bg-gradient-to-r from-purple-100 to-purple-50"
                                },
                                {
                                    title: "Object-Centric Model",
                                    description: "Sui's revolutionary data model enables true digital ownership of commerce assets and reputation.",
                                    icon: "🌐",
                                    highlight: "bg-gradient-to-r from-green-100 to-green-50"
                                }
                            ].map((feature, index) => (
                                <div 
                                    key={index}
                                    className={`relative p-8 rounded-2xl border border-gray-100 ${feature.highlight} shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden`}
                                >
                                    <div className="text-5xl mb-6">{feature.icon}</div>
                                    <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.description}</p>
                                    <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-sui-blue to-sui-blue/20"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="relative py-32 bg-gradient-to-br from-sui-blue to-blue-600 overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-pattern.svg')] bg-repeat"></div>
                    </div>
                    
                    <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-4xl font-bold text-white mb-6">
                            Join the Decentralized Commerce Revolution
                        </h2>
                        <p className="text-xl text-blue-100 mb-10">
                            Be part of the future where commerce is open, transparent, and user-owned.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link href={'/business/create'}>
                                <button className="px-8 py-4 bg-transparent border-2 border-white/80 text-gray-900 rounded-xl font-medium text-lg hover:bg-white/10 transition-all shadow-sm hover:shadow-md">
                                    Start Selling
                                </button>
                            </Link>
                            <button className="px-8 py-4 bg-white text-gray-900 hover:bg-gray-100 text-sui-blue rounded-xl font-medium text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                                Connect Wallet
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AboutSection;