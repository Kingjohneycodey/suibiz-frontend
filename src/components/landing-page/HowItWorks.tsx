
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Search, Shield, Star } from "lucide-react";

export const HowItWorks = () => {
  const steps = [
    {
      icon: Wallet,
      title: "Connect Your Wallet",
      description: "Link your Sui wallet to get started and create your decentralized profile"
    },
    {
      icon: Search,
      title: "Browse & Buy",
      description: "Explore services and products, or list your own offerings on the marketplace"
    },
    {
      icon: Shield,
      title: "Secure Escrow",
      description: "Smart contracts protect both buyers and sellers throughout the transaction"
    },
    {
      icon: Star,
      title: "Build Reputation",
      description: "Leave and receive NFT reviews to build trust in the community"
    }
  ];

  return (
    <section className="py-20 px-4 bg-slate-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            How SuiBiz Works
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Simple, secure, and decentralized. Start trading with confidence on the blockchain.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <Card key={index} className="text-center border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-sm font-medium text-purple-600 mb-2">
                  Step {index + 1}
                </div>
                <CardTitle className="text-xl">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
