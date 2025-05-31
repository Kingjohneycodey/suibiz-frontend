import { Header } from "./Header";
import { Hero } from "./Hero";
import { FeaturedListings } from "./FeaturedListings";
import { HowItWorks } from "./HowItWorks";
import { Stats } from "./Stats";
import { Footer } from "./Footer";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <Header />
            <Hero />
            <Stats />
            <FeaturedListings />
            <HowItWorks />
            <Footer />
        </div>
    )
}