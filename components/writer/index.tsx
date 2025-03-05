'use client'

import { WriterDetails } from "@/components/writer/details";
import WriterConfigPanel from "@/components/writer/config-panel";
import { useState } from "react";

export function Writer() {
  const [showConfig, setShowConfig] = useState(false);

  return (
    <div className="relative">
      <WriterDetails />

      {showConfig && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative">
            <button
              onClick={() => setShowConfig(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <WriterConfigPanel />
          </div>
        </div>
      )}

      <button
        onClick={() => setShowConfig(!showConfig)}
        className="mt-10"
      >
        显示配置
      </button>
    </div>
  );
}
