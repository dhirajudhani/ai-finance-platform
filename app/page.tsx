import Hero from "@/components/Hero";
import { Card, CardContent } from "@/components/ui/card";
import { featuresData, statsData } from "@/data/landing";
import { LucideIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="m-40">
      <Hero />
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statsData.map((statsData, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {statsData.value}
                </div>
                <div className="text-gray-600">{statsData.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center  mb-12">
            Everything you need to manage your finances
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuresData.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card className="p-6" key={index}>
                    <CardContent className="space-y-4 pt-4">
                      <Icon />
                      <h3 className="text-xl font-semibold">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </h2>
        </div>
      </section>
    </div>
  );
}
