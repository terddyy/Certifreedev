import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#000814] text-gray-100">
      <Header />
      <main className="container mx-auto px-6 py-12 md:py-16">
        <Card className="bg-[#001d3d] text-white rounded-xl shadow-xl border border-[#003566]">
          <CardHeader>
            <CardTitle className="text-3xl">Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-gray-300 leading-relaxed">
            <p>By using CertiFree, you agree to these terms.</p>
            <h2 className="text-xl font-semibold text-white">Use of Service</h2>
            <p>Don’t abuse the platform, scrape content, or violate intellectual property.</p>
            <h2 className="text-xl font-semibold text-white">Accounts</h2>
            <p>You are responsible for your account and for activities that occur under your account.</p>
            <h2 className="text-xl font-semibold text-white">Content</h2>
            <p>Providers and certifications may link to third-party sites. We are not responsible for external content.</p>
            <h2 className="text-xl font-semibold text-white">Termination</h2>
            <p>We may suspend accounts that violate policies. You can delete your account at any time.</p>
            <h2 className="text-xl font-semibold text-white">Contact</h2>
            <p>For questions, see Contact Us.</p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
} 