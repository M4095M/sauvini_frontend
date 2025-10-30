"use client";

import { Phone, Mail, MapPin } from "lucide-react";
import Image from "next/image";

export default function ContactUs() {
  return (
    <section className="w-full py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-neutral-600 mb-6">
                  Contact us
                </h2>
                <p className="text-lg text-neutral-500 leading-relaxed">
                  We'd love to hear from you! Whether you're a learner with a
                  question, an educator interested in collaborating, or a
                  partner looking to connect — our team is here to help.
                </p>
              </div>

              {/* Contact Information Blocks */}
              <div className="space-y-6">
                {/* Phone */}
                <div className="flex items-center space-x-4 p-4 bg-neutral-100 rounded-2xl">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-primary-300" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-400 mb-1">Phone</p>
                    <p className="text-lg font-semibold text-neutral-600">
                      +213 545 78 90 43
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center space-x-4 p-4 bg-neutral-100 rounded-2xl">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary-300" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-400 mb-1">Email</p>
                    <p className="text-lg font-semibold text-neutral-600">
                      sauvini@gmail.com
                    </p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-center space-x-4 p-4 bg-neutral-100 rounded-2xl">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary-300" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-400 mb-1">Address</p>
                    <p className="text-lg font-semibold text-neutral-600">
                      Algiers, Algeria
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Illustration */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-80 h-80">
                <Image
                  src="/contact-illustration.png"
                  alt="Contact us illustration - mail delivery scene"
                  width={520}
                  height={520}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
