import { Wallet, FileCheck, Cpu, Share2 } from "lucide-react";

const steps = [
  {
    icon: Wallet,
    title: "Connect Wallet",
    description: "Link your digital wallet to our platform securely. This will be used to store and manage your certificate NFTs."
  },
  {
    icon: FileCheck,
    title: "Verify Credentials",
    description: "We authenticate your academic credentials with your institution through a secure, automated process."
  },
  {
    icon: Cpu,
    title: "Mint NFT",
    description: "Your verified certificate is transformed into a unique NFT on the blockchain, ensuring its authenticity and immutability."
  },
  {
    icon: Share2,
    title: "Share & Verify",
    description: "Easily share your NFT certificate with employers or institutions. They can instantly verify its authenticity on the blockchain."
  }
];

export default function HowItWorks() {
  return (
    <section className="py-16 bg-gradient-to-b from-background to-secondary/10">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-bold text-center mb-12">How It Works</h2>
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary/80 transform -translate-x-1/2" />
          
          {steps.map((step, index) => (
            <div key={index} className={`flex items-center mb-12 md:mb-2 relative ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
              <div className="w-full md:w-1/2 px-4">
                <div className="bg-card p-6 rounded-lg hover:border-blue-400 shadow-lg border-primary border relative">
                  <div className={`absolute top-6 ${index % 2 === 0 ? 'left-0 transform -translate-x-1/2' : 'right-0 transform translate-x-1/2'} w-4 h-4 rounded-full bg-green-600 hidden md:block`} />
                  <step.icon className="h-10 w-10 text-white mb-4 mx-auto md:mx-0" />
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-primary-foreground font-bold md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
