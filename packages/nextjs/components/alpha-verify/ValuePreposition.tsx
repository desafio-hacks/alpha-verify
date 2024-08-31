import { Shield, Globe, Clock } from "lucide-react";

const valueProps = [
    {
      icon: Shield,
      title: "Tamper-Proof Security",
      description: "Your academic credentials are securely stored on the blockchain, ensuring they can never be altered or falsified."
    },
    {
      icon: Globe,
      title: "Global Verification",
      description: "Employers worldwide can instantly verify your credentials, streamlining the hiring process and boosting your career prospects."
    },
    {
      icon: Clock,
      title: "Lifetime Access",
      description: "Access and share your certificates anytime, anywhere, without relying on your educational institution's systems."
    }
  ]

const ValuePreposition = () => {
  return (
    <section className="py-44 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-6xl font-bold text-center mb-12">Why Choose Blockchain Certificates?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
          {valueProps.map((prop, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center text-center p-6 bg-transparent border border-primary rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:border-secondary/40 hover:-translate-y-1"
            >
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <prop.icon className="h-12 w-12 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{prop.title}</h3>
              <p className="text-muted-foreground">{prop.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ValuePreposition