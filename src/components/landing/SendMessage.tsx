"use client";

import { useState } from "react";
import { Send, ChevronDown } from "lucide-react";
import emailjs from "@emailjs/browser";

export default function SendMessage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      // EmailJS configuration - validate environment variables
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      // Validate that all EmailJS configuration is set
      if (!serviceId || serviceId === "your_service_id" || !serviceId.trim()) {
        console.error("EmailJS Service ID is not configured");
        setSubmitStatus({
          type: "error",
          message:
            "Email service is not properly configured. Please contact support.",
        });
        setIsLoading(false);
        return;
      }

      if (
        !templateId ||
        templateId === "your_template_id" ||
        !templateId.trim()
      ) {
        console.error("EmailJS Template ID is not configured");
        setSubmitStatus({
          type: "error",
          message:
            "Email service is not properly configured. Please contact support.",
        });
        setIsLoading(false);
        return;
      }

      if (!publicKey || publicKey === "your_public_key" || !publicKey.trim()) {
        console.error("EmailJS Public Key is not configured");
        setSubmitStatus({
          type: "error",
          message:
            "Email service is not properly configured. Please contact support.",
        });
        setIsLoading(false);
        return;
      }

      // Prepare template parameters
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_name: "Sauvini Team",
      };

      // Send email using EmailJS
      await emailjs.send(serviceId, templateId, templateParams, publicKey);

      setSubmitStatus({
        type: "success",
        message:
          "Thank you! Your message has been sent successfully. We'll get back to you soon.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error: any) {
      console.error("EmailJS error:", error);

      // Provide more specific error messages
      let errorMessage =
        "Sorry, there was an error sending your message. Please try again or contact us directly.";

      if (error?.text?.includes("Public Key")) {
        errorMessage =
          "Email service configuration error. Please contact support with this error code: EMAILJS_KEY_INVALID";
      } else if (error?.text?.includes("Service ID")) {
        errorMessage =
          "Email service configuration error. Please contact support with this error code: EMAILJS_SERVICE_INVALID";
      } else if (error?.text?.includes("Template")) {
        errorMessage =
          "Email service configuration error. Please contact support with this error code: EMAILJS_TEMPLATE_INVALID";
      }

      setSubmitStatus({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 md:p-12">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Send Us a Message
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-neutral-600"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Name"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-200 transition-colors text-neutral-600 text-sm sm:text-base"
                  required
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-neutral-600"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-200 transition-colors text-neutral-600 text-sm sm:text-base"
                  required
                />
              </div>
            </div>

            {/* Subject Field */}
            <div className="space-y-2">
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-neutral-600"
              >
                Subject
              </label>
              <div className="relative">
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-200 transition-colors appearance-none bg-white text-neutral-600 text-sm sm:text-base"
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="partnership">Partnership</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
              </div>
            </div>

            {/* Message Field */}
            <div className="space-y-2">
              <label
                htmlFor="message"
                className="block text-sm font-medium text-neutral-600"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Tell us how we can help you..."
                rows={6}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-200 transition-colors resize-none text-neutral-600 text-sm sm:text-base"
                required
              />
            </div>

            {/* Status Message */}
            {submitStatus.type && (
              <div
                className={`p-4 rounded-xl ${
                  submitStatus.type === "success"
                    ? "bg-success-100 border border-success-200 text-success-400"
                    : "bg-error-100 border border-error-200 text-error-400"
                }`}
              >
                <p className="text-sm font-medium">{submitStatus.message}</p>
              </div>
            )}

            {/* Disclaimer Text */}
            <p className="text-sm text-neutral-400 text-center">
              Our team will review your message and get back to you as soon as
              possible.
            </p>

            {/* Submit Button */}
            <div className="flex justify-center sm:justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-primary-300 hover:bg-primary-200 disabled:bg-neutral-200 disabled:cursor-not-allowed text-neutral-100 px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-colors w-full sm:w-auto text-sm sm:text-base"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Send</span>
                    <Send className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
