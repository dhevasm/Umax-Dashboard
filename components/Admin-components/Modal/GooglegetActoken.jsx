'use client'
import React, { useState } from "react";
import { FaQuestion, FaQuestionCircle, FaTimes } from "react-icons/fa"; 
import Image from "next/image";
import { useTranslations } from "next-intl";


function GooglegetActoken() {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(0);
    const t = useTranslations("tutorial");
  
    const openModal = () => {
      setIsOpen(true);
      setStep(0);
    };
    const closeModal = () => setIsOpen(false);
  
    const steps = [
      {
        text: `${t("google-t1")}` , 
        img: "/assets/GoogleGetToken/Google1.png", 
      },
      {
        text: `${t("google-t2")}`,
        img: "/assets/GoogleGetToken/Google2.png",
      },
      {
        text: `${t("google-t3")}`,
        img: "/assets/GoogleGetToken/Google3.png",
      },
    ];
  
    const handleNext = () => {
      if (step < steps.length - 1) {
        setStep(step + 1);
      }
    };
  
    const handlePrevious = () => {
      if (step > 0) {
        setStep(step - 1);
      }
    };
  
    return (
      <div>
        <button type="button" onClick={openModal} className="w-full hover:cursor-pointer bg-[#3b50df] hover:bg-blue-700 border border-indigo-700 mt-5 text-white py-2 px-4 rounded-[3px] text-center">{t("how-to")}</button>
  
        {/* Modal */}
        {isOpen && (
          <>
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="fixed z-40 w-screen h-screen top-0 left-0" onClick={closeModal}></div>
            <div className="bg-white dark:bg-slate-800 text-black dark:text-white rounded-sm w-[700px] p-6 shadow-lg z-50">
              {/* Modal Header */}
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{t("google-title")}</h2>
                
                <div
                  className="hover:cursor-pointer text-gray-500 hover:text-gray-700"
                  onClick={closeModal}
                >
                  <FaTimes/>
                </div>
              </div>
  
              {/* Modal Body (Image and Text) */}
              <div className="mt-4 flex flex-col items-center">
                <Image
                  src={steps[step].img}
                  alt={`Step ${step + 1}`}
                  className="w-[700px] h-auto object-cover rounded-md mb-4"
                  width={700}
                  height={400}
                />
                <p className="text-gray-600 dark:text-white text-center">{steps[step].text}</p>
              </div>
  
              {/* Modal Footer with Next and Previous Buttons */}
              <div className="mt-6 flex justify-between items-center">
                <button
                type="button"
                  className={`px-4 py-2 bg-gray-300 text-gray-600 rounded-md ${
                    step === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-400"
                  }`}
                  onClick={handlePrevious}
                  disabled={step === 0}
                >
                  {t("previous")}
                </button>
  
                {/* Current Page / Total Pages */}
                <span className="text-gray-600 dark:text-white">
                  {step + 1} / {steps.length}
                </span>
  
                <button
                type="button"
                  className={`px-4 py-2 ${
                    step === steps.length - 1
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  } rounded-md`}
                  onClick={step === steps.length - 1 ? closeModal : handleNext}
                >
                  {step === steps.length - 1 ? `${t("finish")}` : `${t("next")}`}
                </button>
              </div>
            </div>
          </div>
          </>
        )}
      </div>
    );
}

export default GooglegetActoken