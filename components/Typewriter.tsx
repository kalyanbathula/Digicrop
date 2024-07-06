"use client";
import { TypewriterEffect } from "./ui/typewriter-effect";

export const TypewriterEffectDemo = () => {
  const words = [
        
    {
      text: "Your",
    },
    {
      text: "Path",
    },
    {
      text: "to",
    },
    {
      text: "Precision",
    },
    {
      text: "Agriculture.",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-[15rem]">
      <p className="chatbot-text-primary text-lg mb-10 ">
      Unlock Smart Farming with DigiCrop
      </p>
      <TypewriterEffect words={words} />
   
    </div>
  );
};
