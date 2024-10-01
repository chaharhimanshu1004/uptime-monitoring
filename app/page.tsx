"use client";

import { FeaturesSectionDemo } from "./acertinity-components/Feature-section";
import GetStarted from "@/components/GetStarted";
export default function Home() {

  
  return (
    <div className="dark bg-black min-h-screen">
      <GetStarted/>
      <FeaturesSectionDemo/>
    </div>
  );
}