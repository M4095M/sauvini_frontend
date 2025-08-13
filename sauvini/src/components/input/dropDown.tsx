"use client";

import { DropDownProps } from "@/types/dropDownProps";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const wilayas = [
  { id: 1, wilaya_name: "01-Adrar" },
  { id: 2, wilaya_name: "02-Chlef" },
  { id: 3, wilaya_name: "03-Laghouat" },
  { id: 4, wilaya_name: "04-Oum El Bouaghi" },
  { id: 5, wilaya_name: "05-Batna" },
  { id: 6, wilaya_name: "06-Béjaïa" },
  { id: 7, wilaya_name: "07-Biskra" },
  { id: 8, wilaya_name: "08-Béchar" },
  { id: 9, wilaya_name: "09-Blida" },
  { id: 10, wilaya_name: "10-Bouira" },
  { id: 11, wilaya_name: "11-Tamanrasset" },
  { id: 12, wilaya_name: "12-Tébessa" },
  { id: 13, wilaya_name: "13-Tlemcen" },
  { id: 14, wilaya_name: "14-Tiaret" },
  { id: 15, wilaya_name: "15-Tizi Ouzou" },
  { id: 16, wilaya_name: "16-Alger" },
  { id: 17, wilaya_name: "17-Djelfa" },
  { id: 18, wilaya_name: "18-Jijel" },
  { id: 19, wilaya_name: "19-Sétif" },
  { id: 20, wilaya_name: "20-Saïda" },
  { id: 21, wilaya_name: "21-Skikda" },
  { id: 22, wilaya_name: "22-Sidi Bel Abbès" },
  { id: 23, wilaya_name: "23-Annaba" },
  { id: 24, wilaya_name: "24-Guelma" },
  { id: 25, wilaya_name: "25-Constantine" },
  { id: 26, wilaya_name: "26-Médéa" },
  { id: 27, wilaya_name: "27-Mostaganem" },
  { id: 28, wilaya_name: "28-M'Sila" },
  { id: 29, wilaya_name: "29-Mascara" },
  { id: 30, wilaya_name: "30-Ouargla" },
  { id: 31, wilaya_name: "31-Oran" },
  { id: 32, wilaya_name: "32-El Bayadh" },
  { id: 33, wilaya_name: "33-Illizi" },
  { id: 34, wilaya_name: "34-Bordj Bou Arreridj" },
  { id: 35, wilaya_name: "35-Boumerdès" },
  { id: 36, wilaya_name: "36-El Tarf" },
  { id: 37, wilaya_name: "37-Tindouf" },
  { id: 38, wilaya_name: "38-Tissemsilt" },
  { id: 39, wilaya_name: "39-El Oued" },
  { id: 40, wilaya_name: "40-Khenchela" },
  { id: 41, wilaya_name: "41-Souk Ahras" },
  { id: 42, wilaya_name: "42-Tipaza" },
  { id: 43, wilaya_name: "43-Mila" },
  { id: 44, wilaya_name: "44-Aïn Defla" },
  { id: 45, wilaya_name: "45-Naâma" },
  { id: 46, wilaya_name: "46-Aïn Témouchent" },
  { id: 47, wilaya_name: "47-Ghardaïa" },
  { id: 48, wilaya_name: "48-Relizane" },
  { id: 49, wilaya_name: "49-El M'Ghair" },
  { id: 50, wilaya_name: "50-El Menia" },
  { id: 51, wilaya_name: "51-Ouled Djellal" },
  { id: 52, wilaya_name: "52-Bordj Badji Mokhtar" },
  { id: 53, wilaya_name: "53-Béni Abbès" },
  { id: 54, wilaya_name: "54-Timimoun" },
  { id: 55, wilaya_name: "55-Touggourt" },
  { id: 56, wilaya_name: "56-Djanet" },
  { id: 57, wilaya_name: "57-In Salah" },
  { id: 58, wilaya_name: "58-In Guezzam" },
];

export default function DropDown({
  label,
  placeholder,
  options,
  t,
  isRTL,
}: DropDownProps) {
  const [currentWilaya, setCurrentWilaya] = useState("");
  const [showList, setShowList] = useState(false);

  return (
    <div className="max-w-xl min-w-2xs shrink grow flex flex-col gap-2">
      <div className="font-work-sans text-neutral-600 font-normal px-4">
        {label}
      </div>
      <div
        className="flex flex-row w-full justify-center items-center
      bg-white border border-neutral-200 rounded-full
        text-work-sans font-normal text-base relative"
      >
        <input
          type="text"
          value={currentWilaya}
          readOnly
          className="appearance-none outline-none p-0 m-0 shadow-none 
         border-neutral-200 px-5 py-3 w-full
        text-work-sans font-normal text-base text-neutral-600"
        />
        <button className="px-4" onClick={() => setShowList(!showList)}>
          <ChevronDown className="text-neutral-400" />
        </button>
        {showList && (
          <div
            className="absolute top-[101%] bg-white border border-neutral-200 rounded-2xl w-full max-h-40
            text-work-sans font-normal text-base overflow-y-auto z-1"
          >
            {wilayas.map((wilaya) => {
              return (
                <div
                  className="text-work-sans font-normal text-base text-neutral-600 px-5 py-4 w-full hover:bg-neutral-200 cursor-pointer"
                  key={wilaya.id}
                  onClick={() => {
                    setCurrentWilaya(wilaya.wilaya_name)
                  }}
                >
                  {wilaya.wilaya_name}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
