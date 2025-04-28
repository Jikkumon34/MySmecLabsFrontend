"use client";

import { useState } from "react";
import { ClipboardCopy } from "lucide-react";

interface ReferralActionsClientProps {
  referralCode: string;
}

export default function ReferralActionsClient({ referralCode }: ReferralActionsClientProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    
    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <button
      onClick={copyToClipboard}
      className="text-[#2E3192] hover:text-blue-700 focus:outline-none transition-colors"
      title="Copy referral code"
    >
      <ClipboardCopy size={20} />
      {copied && (
        <span className="absolute -top-8 -right-4 bg-gray-800 text-white text-xs px-2 py-1 rounded">
          Copied!
        </span>
      )}
    </button>
  );
}