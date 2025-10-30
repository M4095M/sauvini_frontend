"use client"

import { useLanguage } from "@/context/LanguageContext"

export default function TermsPage() {
    const { t } = useLanguage()
    return (
    <div className="pt-32 gradient-background-gradient ">
      <div className="flex flex-col gap-4 p-28 rounded-[112px] bg-neutral-100">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-4">{t("terms.title")}</h1>
        <p className="text-gray-600 mb-8">{t("terms.subtitle")}</p>

        {/* Sections */}
        <div className="space-y-6">
          {/* 1. Intellectual Property */}
          <section>
            <h2 className="font-bold text-lg mb-2">
              {t("terms.sections.intellectualProperty.title")}
            </h2>
            <ul className="list-disc ml-6 text-gray-700 space-y-1">
              <li>{t("terms.sections.intellectualProperty.item1")}</li>
              <li>{t("terms.sections.intellectualProperty.item2")}</li>
              <li>{t("terms.sections.intellectualProperty.item3")}</li>
            </ul>
          </section>

          {/* 2. Respect and Courtesy */}
          <section>
            <h2 className="font-bold text-lg mb-2">
              {t("terms.sections.respect.title")}
            </h2>
            <ul className="list-disc ml-6 text-gray-700 space-y-1">
              <li>{t("terms.sections.respect.item1")}</li>
              <li>{t("terms.sections.respect.item2")}</li>
              <li>{t("terms.sections.respect.item3")}</li>
              <li>{t("terms.sections.respect.item4")}</li>
              <li>{t("terms.sections.respect.item5")}</li>
            </ul>
          </section>

          {/* 3. Respect for Deadlines */}
          <section>
            <h2 className="font-bold text-lg mb-2">
              {t("terms.sections.deadlines.title")}
            </h2>
            <ul className="list-disc ml-6 text-gray-700 space-y-1">
              <li>{t("terms.sections.deadlines.item1")}</li>
              <li>{t("terms.sections.deadlines.item2")}</li>
            </ul>
          </section>

          {/* 4. Account Security */}
          <section>
            <h2 className="font-bold text-lg mb-2">
              {t("terms.sections.security.title")}
            </h2>
            <ul className="list-disc ml-6 text-gray-700 space-y-1">
              <li>{t("terms.sections.security.item1")}</li>
              <li>{t("terms.sections.security.item2")}</li>
              <li>{t("terms.sections.security.item3")}</li>
            </ul>
          </section>

          {/* 5. Fraud and Cheating */}
          <section>
            <h2 className="font-bold text-lg mb-2">
              {t("terms.sections.fraud.title")}
            </h2>
            <ul className="list-disc ml-6 text-gray-700 space-y-1">
              <li>{t("terms.sections.fraud.item1")}</li>
              <li>{t("terms.sections.fraud.item2")}</li>
            </ul>
          </section>

          {/* 6. Technical Protection */}
          <section>
            <h2 className="font-bold text-lg mb-2">
              {t("terms.sections.technical.title")}
            </h2>
            <ul className="list-disc ml-6 text-gray-700 space-y-1">
              <li>{t("terms.sections.technical.item1")}</li>
              <li>{t("terms.sections.technical.item2")}</li>
            </ul>
          </section>

          {/* 7. Privacy */}
          <section>
            <h2 className="font-bold text-lg mb-2">
              {t("terms.sections.privacy.title")}
            </h2>
            <ul className="list-disc ml-6 text-gray-700 space-y-1">
              <li>{t("terms.sections.privacy.item1")}</li>
              <li>{t("terms.sections.privacy.item2")}</li>
              <li>{t("terms.sections.privacy.item3")}</li>
            </ul>
          </section>

          {/* 8. Student Responsibility */}
          <section>
            <h2 className="font-bold text-lg mb-2">
              {t("terms.sections.responsibility.title")}
            </h2>
            <ul className="list-disc ml-6 text-gray-700 space-y-1">
              <li>{t("terms.sections.responsibility.item1")}</li>
              <li>{t("terms.sections.responsibility.item2")}</li>
              <li>{t("terms.sections.responsibility.item3")}</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
    )
}