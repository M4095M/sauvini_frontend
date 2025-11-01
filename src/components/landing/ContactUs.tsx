"use client";

import { Phone, Mail, MapPin } from "lucide-react";
import Image from "next/image";

export default function ContactUs() {
  return (
    <section className="w-full py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center">
            {/* Left Side - Contact Information */}
            <div className="space-y-6 md:space-y-8 order-2 lg:order-1">
              <div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-600 mb-4 sm:mb-6">
                  Contact us
                </h2>
                <p className="text-base sm:text-lg text-neutral-500 leading-relaxed">
                  We'd love to hear from you! Whether you're a learner with a
                  question, an educator interested in collaborating, or a
                  partner looking to connect — our team is here to help.
                </p>
              </div>

              {/* Contact Information Blocks */}
              <div className="space-y-4 sm:space-y-6">
                {/* Phone */}
                <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-neutral-100 rounded-xl sm:rounded-2xl">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-primary-300" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-neutral-400 mb-0.5 sm:mb-1">
                      Phone
                    </p>
                    <p className="text-base sm:text-lg font-semibold text-neutral-600 truncate">
                      +213 545 78 90 43
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-neutral-100 rounded-xl sm:rounded-2xl">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-primary-300" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-neutral-400 mb-0.5 sm:mb-1">
                      Email
                    </p>
                    <p className="text-base sm:text-lg font-semibold text-neutral-600 break-all sm:break-normal">
                      sauvini@gmail.com
                    </p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-neutral-100 rounded-xl sm:rounded-2xl">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-primary-300" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-neutral-400 mb-0.5 sm:mb-1">
                      Address
                    </p>
                    <p className="text-base sm:text-lg font-semibold text-neutral-600">
                      Algiers, Algeria
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Illustration */}
            <div className="flex justify-center lg:justify-end order-first lg:order-none">
              <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px] xl:w-80 aspect-square">
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
