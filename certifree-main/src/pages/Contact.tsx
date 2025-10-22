import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useRecaptcha } from "@/hooks/useRecaptcha";
import { 
  Send, 
  Mail, 
  MapPin, 
  MessageSquare,
  CheckCircle2,
  Loader2,
  Shield
} from "lucide-react";

const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT || "https://formspree.io/f/xkgqywkj";
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || "";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const Contact = () => {
  const { toast } = useToast();
  const { executeRecaptcha, loaded: recaptchaLoaded, error: recaptchaError } = useRecaptcha(RECAPTCHA_SITE_KEY);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (recaptchaError) {
      // Silent fail - form will work without reCAPTCHA
    }
  }, [recaptchaError]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Execute reCAPTCHA v3 before submitting
      let recaptchaToken = '';
      if (recaptchaLoaded && RECAPTCHA_SITE_KEY) {
        try {
          recaptchaToken = await executeRecaptcha('contact_form');
        } catch (err) {
          console.error('reCAPTCHA execution failed:', err);
          // Continue without reCAPTCHA if it fails
        }
      }

      // Prepare form data with reCAPTCHA token
      const submitData = {
        ...formData,
        'g-recaptcha-response': recaptchaToken,
      };

      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: JSON.stringify(submitData),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      // Success
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      toast({
        title: "Message Sent! ✅",
        description: "Thank you for contacting us. We'll get back to you soon!",
      });
    } catch (error: any) {
      console.error("Form submission error:", error);
      toast({
        title: "Send Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      detail: "terddy03@gmail.com",
      link: "mailto:terddy03@gmail.com",
    },
    {
      icon: MapPin,
      title: "Location",
      detail: "Marikina, PH",
      link: null,
    },
    {
      icon: MessageSquare,
      title: "Response Time",
      detail: "Within 24-48 hours",
      link: null,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001d3d] via-[#003566] to-[#000814] text-gray-100">
      <Header />

      <main className="container mx-auto px-6 py-12 md:py-16">
        {/* Page Header */}
        <div className="mb-12 text-center relative">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#ffd60a]/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#003566]/20 rounded-full blur-3xl"></div>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
            Get in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffc300] to-[#ffd60a]">
              Touch
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Have a question or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-[#001d3d] border-[#003566] shadow-xl">
              <CardHeader>
                <CardTitle className="text-white">Contact Information</CardTitle>
                <CardDescription className="text-gray-400">
                  We're here to help and answer any questions you might have
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactInfo.map((info) => (
                  <div key={info.title} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#ffc300] to-[#ffd60a] flex items-center justify-center flex-shrink-0">
                      <info.icon className="h-5 w-5 text-[#001d3d]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-400 mb-1">
                        {info.title}
                      </p>
                      {info.link ? (
                        <a
                          href={info.link}
                          className="text-white hover:text-[#ffd60a] transition-colors"
                        >
                          {info.detail}
                        </a>
                      ) : (
                        <p className="text-white">{info.detail}</p>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* FAQ Prompt */}
            <Card className="bg-gradient-to-br from-[#003566] to-[#001d3d] border-[#ffd60a]/20 shadow-xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Looking for Quick Answers?
                </h3>
                <p className="text-gray-300 text-sm mb-4">
                  Check out our FAQ section for instant answers to common questions.
                </p>
                <Button
                  variant="outline"
                  className="w-full border-[#ffd60a]/30 text-[#ffd60a] hover:bg-[#ffd60a]/10"
                  onClick={() => window.location.href = "/how-it-works"}
                >
                  View FAQ
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="bg-[#001d3d] border-[#003566] shadow-xl">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Send us a Message</CardTitle>
                <CardDescription className="text-gray-400">
                  Fill out the form below and we'll get back to you within 24-48 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#ffc300] to-[#ffd60a] flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="h-10 w-10 text-[#001d3d]" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">
                      Message Sent Successfully!
                    </h3>
                    <p className="text-gray-300 mb-6">
                      Thank you for contacting us. We've received your message and will respond soon.
                    </p>
                    <Button
                      onClick={() => setSubmitted(false)}
                      className="bg-gradient-to-r from-[#ffc300] to-[#ffd60a] text-[#001d3d] font-bold hover:shadow-lg hover:shadow-[#ffd60a]/30"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Name Field */}
                      <div>
                        <Label htmlFor="name" className="text-gray-300">
                          Name *
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`bg-[#000814] border-[#003566] text-white placeholder-gray-500 focus:border-[#ffd60a] focus:ring-[#ffd60a] ${
                            errors.name ? "border-red-500" : ""
                          }`}
                          placeholder="Your full name"
                          disabled={loading}
                        />
                        {errors.name && (
                          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                        )}
                      </div>

                      {/* Email Field */}
                      <div>
                        <Label htmlFor="email" className="text-gray-300">
                          Email *
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`bg-[#000814] border-[#003566] text-white placeholder-gray-500 focus:border-[#ffd60a] focus:ring-[#ffd60a] ${
                            errors.email ? "border-red-500" : ""
                          }`}
                          placeholder="your.email@example.com"
                          disabled={loading}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    {/* Subject Field */}
                    <div>
                      <Label htmlFor="subject" className="text-gray-300">
                        Subject (Optional)
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="bg-[#000814] border-[#003566] text-white placeholder-gray-500 focus:border-[#ffd60a] focus:ring-[#ffd60a]"
                        placeholder="What is this regarding?"
                        disabled={loading}
                      />
                    </div>

                    {/* Message Field */}
                    <div>
                      <Label htmlFor="message" className="text-gray-300">
                        Message *
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={6}
                        className={`bg-[#000814] border-[#003566] text-white placeholder-gray-500 focus:border-[#ffd60a] focus:ring-[#ffd60a] resize-none ${
                          errors.message ? "border-red-500" : ""
                        }`}
                        placeholder="Tell us more about your inquiry..."
                        disabled={loading}
                      />
                      {errors.message && (
                        <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                      )}
                      <p className="text-gray-500 text-xs mt-1">
                        Minimum 10 characters
                      </p>
                    </div>

                    {/* Honeypot field for spam protection (hidden from users) */}
                    <input
                      type="text"
                      name="_gotcha"
                      className="hidden"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                    />

                    {/* reCAPTCHA Notice */}
                    {RECAPTCHA_SITE_KEY && (
                      <div className="flex items-center gap-2 text-xs text-gray-500 bg-[#000814]/50 p-3 rounded-lg border border-[#003566]">
                        <Shield className="h-4 w-4 text-[#ffd60a]" />
                        <span>
                          Protected by Google reCAPTCHA v3 for spam prevention
                        </span>
                      </div>
                    )}

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-[#ffc300] to-[#ffd60a] text-[#001d3d] font-bold py-6 text-lg hover:shadow-lg hover:shadow-[#ffd60a]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>

                    <p className="text-gray-500 text-xs text-center">
                      By submitting this form, you agree to our{" "}
                      <a href="/privacy" className="text-[#ffd60a] hover:underline">
                        Privacy Policy
                      </a>
                      . We respect your privacy and will never share your information.
                      {RECAPTCHA_SITE_KEY && (
                        <>
                          {" "}This site is protected by reCAPTCHA and the Google{" "}
                          <a 
                            href="https://policies.google.com/privacy" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[#ffd60a] hover:underline"
                          >
                            Privacy Policy
                          </a>
                          {" "}and{" "}
                          <a 
                            href="https://policies.google.com/terms" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[#ffd60a] hover:underline"
                          >
                            Terms of Service
                          </a>
                          {" "}apply.
                        </>
                      )}
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;