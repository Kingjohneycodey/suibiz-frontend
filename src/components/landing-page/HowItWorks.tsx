import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

export const HowItWorks = () => {
  const steps = [
    {
      title: "Create Your Product",
      description: "Sign up in minutes and set up your secure vendor profile. Get verified and gain access to powerful tools to manage your store.",
      image: "/box-1.png"
    },
    {
      title: "Upload Your Products",
      description: "Easily add product listings with images, pricing, and descriptions. Our intuitive dashboard makes managing inventory simple.",
      image: "/box-2.png"
    },
    {
      title: "Start Selling Products",
      description: "Once live, your products are ready for customers. With secure escrow, low transaction fees, and full transparency, you can sell confidently and get paid safely.",
      image: "/box-3.png"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 bg-slate-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            How It Works
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Simple, secure, and easy to use. Start selling with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="group overflow-hidden">
              <div className="w-full h-[443px] relative mb-4 rounded-lg overflow-hidden">
                <Image 
                  src={step.image}
                  alt={step.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300 rounded-4xl"
                />
              </div>
              
              <div className="p-0">
                <h3 className="text-3xl font-semibold text-black mb-2">
                  {step.title}
                </h3>
                <p className="text-black">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/business/create">
            <Button size="lg" variant="outline" className="text-gray-900 text-lg px-8 py-3 border-2">
              Start Selling
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};