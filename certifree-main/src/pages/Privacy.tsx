import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#000814] text-gray-100">
      <Header />
      <main className="container mx-auto px-6 py-12 md:py-16">
        <Card className="bg-[#001d3d] text-white rounded-xl shadow-xl border border-[#003566]">
          <CardHeader>
            <CardTitle className="text-3xl">Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-gray-300 leading-relaxed">
            <p>We respect your privacy. This page explains what information we collect and how we use it.</p>
            <h2 className="text-xl font-semibold text-white">Information We Collect</h2>
            <p>Account details (name, email), usage data (pages viewed), and content you provide (favorites, progress).</p>
            <h2 className="text-xl font-semibold text-white">How We Use Data</h2>
            <p>To provide core features like authentication, favorites, and progress tracking, improve the product, and communicate important updates.</p>
            <h2 className="text-xl font-semibold text-white">Your Choices</h2>
            <p>You can delete your account, remove favorites/progress, and request data export by contacting support.</p>
            <h2 className="text-xl font-semibold text-white">Contact</h2>
            <p>Questions? Visit Contact Us.</p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
} 