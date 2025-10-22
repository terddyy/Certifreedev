import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HowItWorks() {
  const steps = [
    { title: "Create your account", description: "Sign up with your name and email. No email verification required.", imgAlt: "Sign up screenshot" },
    { title: "Browse certifications", description: "Filter by category or provider and open a certification you like.", imgAlt: "Browse list screenshot" },
    { title: "Track your progress", description: "Click 'I am taking this cert' to track it from your dashboard.", imgAlt: "Taking button screenshot" },
    { title: "Complete and celebrate", description: "Finish the course/exam and mark it 'Completed' in the detail page.", imgAlt: "Completed state screenshot" },
  ];

  const videoId = import.meta.env.VITE_HOW_IT_WORKS_VIDEO_ID || "ysz5S6PUM-U";

  return (
    <div className="min-h-screen bg-[#000814] text-gray-100">
      <Header />
      <main className="container mx-auto px-6 py-12 md:py-16 space-y-8">
        <Card className="bg-[#001d3d] text-white rounded-xl shadow-xl border border-[#003566]">
          <CardHeader>
            <CardTitle className="text-3xl">How it works</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-8">
            <div className="w-full rounded-xl overflow-hidden border border-[#003566] bg-[#000f24]">
              <div className="relative w-full pt-[56.25%]">
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                  title="How CertiFree works"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {steps.map((s, i) => (
                <div key={i} className="space-y-3">
                  <div className="w-full h-40 rounded-lg bg-[#003566] flex items-center justify-center text-gray-300">{s.imgAlt} (placeholder)</div>
                  <h3 className="text-xl font-semibold text-white">{i + 1}. {s.title}</h3>
                  <p className="text-gray-300">{s.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
} 