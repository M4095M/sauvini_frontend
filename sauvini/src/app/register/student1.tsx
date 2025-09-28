"use client";

import DropDown from "@/components/input/dropDown";
import InputButton from "@/components/input/InputButton";
import SimpleInput from "@/components/input/simpleInput";
import Button from "@/components/ui/button";
import { DropDownOptionProps } from "@/types/dropDownProps";
import { RegisterCommonProps } from "@/types/registerCommonProps";
import { ArrowLeft, ArrowRight, Phone } from "lucide-react";

const wilayas: DropDownOptionProps[] = [
  { id: 1, text: "Adrar" },
  { id: 2, text: "Chlef" },
  { id: 3, text: "Laghouat" },
  { id: 4, text: "Oum El Bouaghi" },
  { id: 5, text: "Batna" },
  { id: 6, text: "Béjaïa" },
  { id: 7, text: "Biskra" },
  { id: 8, text: "Béchar" },
  { id: 9, text: "Blida" },
  { id: 10, text: "Bouira" },
  { id: 11, text: "Tamanrasset" },
  { id: 12, text: "Tébessa" },
  { id: 13, text: "Tlemcen" },
  { id: 14, text: "Tiaret" },
  { id: 15, text: "Tizi Ouzou" },
  { id: 16, text: "Alger" },
  { id: 17, text: "Djelfa" },
  { id: 18, text: "Jijel" },
  { id: 19, text: "Sétif" },
  { id: 20, text: "Saïda" },
  { id: 21, text: "Skikda" },
  { id: 22, text: "Sidi Bel Abbès" },
  { id: 23, text: "Annaba" },
  { id: 24, text: "Guelma" },
  { id: 25, text: "Constantine" },
  { id: 26, text: "Médéa" },
  { id: 27, text: "Mostaganem" },
  { id: 28, text: "M’Sila" },
  { id: 29, text: "Mascara" },
  { id: 30, text: "Ouargla" },
  { id: 31, text: "Oran" },
  { id: 32, text: "El Bayadh" },
  { id: 33, text: "Illizi" },
  { id: 34, text: "Bordj Bou Arréridj" },
  { id: 35, text: "Boumerdès" },
  { id: 36, text: "El Tarf" },
  { id: 37, text: "Tindouf" },
  { id: 38, text: "Tissemsilt" },
  { id: 39, text: "El Oued" },
  { id: 40, text: "Khenchela" },
  { id: 41, text: "Souk Ahras" },
  { id: 42, text: "Tipaza" },
  { id: 43, text: "Mila" },
  { id: 44, text: "Aïn Defla" },
  { id: 45, text: "Naâma" },
  { id: 46, text: "Aïn Témouchent" },
  { id: 47, text: "Ghardaïa" },
  { id: 48, text: "Relizane" },
  { id: 49, text: "El M'ghair" },
  { id: 50, text: "El Meniaa" },
  { id: 51, text: "Ouled Djellal" },
  { id: 52, text: "Bordj Baji Mokhtar" },
  { id: 53, text: "Béni Abbès" },
  { id: 54, text: "Timimoun" },
  { id: 55, text: "Touggourt" },
  { id: 56, text: "Djanet" },
  { id: 57, text: "In Salah" },
  { id: 58, text: "In Guezzam" },
];

export default function RegisterPart1({
  t,
  isRTL,
  language,
  NextStep,
  PreviousStep,
  register,
  errors,
}: RegisterCommonProps) {
  console.log("Rendering RegisterPart1");
  return (
    <div className="w-fit h-full p-10 flex flex-col justify-center items-center gap-10 mt-15">
      {/* Header */}
      <div className="flex flex-col justify-center items-center gap-2">
        <span className="font-semibold lg:text-4xl text-neutral-600 text-center text-2xl">
          {t("register.student.page_1.title")}
        </span>
        <span className="font-medium lg:text-xl text-neutral-400 text-center text-base">
          {t("register.student.page_1.description")}
        </span>
      </div>
      {/* input fields */}
      <div className="flex flex-col gap-6" dir={isRTL ? "rtl" : "ltr"}>
        <div className="flex flex-row flex-wrap gap-4">
          <SimpleInput
            label={t("register.common.firstname")}
            value={"firstname"}
            type="text"
            {...register("first_name")}
            errors={errors?.first_name}
          />
          <SimpleInput
            label={t("register.common.lastname")}
            value={"lastname"}
            type="text"
            {...register("last_name")}
            errors={errors?.last_name}
          />
        </div>
        <DropDown
          label={t("register.common.Wilaya")}
          t={t}
          options={wilayas}
          placeholder={"Wilaya"}
          {...register("wilaya")}
          errors={errors?.wilaya}
        />
        <InputButton
          label={t("register.common.phone")}
          type="icon"
          icon={<Phone />}
          icon_position="left"
          {...register("phone_number")}
          errors={errors?.phone_number}
        />
      </div>
      {/* buttons */}
      <div className="flex flex-row gap-4 " dir={isRTL ? "rtl" : "ltr"}>
        <Button
          state={"outlined"}
          size={"M"}
          icon_position={isRTL ? "left" : "left"}
          text={t("register.common.previous")}
          icon={!isRTL ? <ArrowLeft /> : <ArrowRight />}
          onClick={PreviousStep}
        />
        <Button
          state={"filled"}
          size={"M"}
          icon_position={isRTL ? "right" : "right"}
          text={t("register.common.next")}
          icon={isRTL ? <ArrowLeft /> : <ArrowRight />}
          onClick={NextStep}
        />
      </div>
    </div>
  );
}
