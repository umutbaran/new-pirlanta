'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpen?: boolean;
}

export default function AccordionItem({ title, children, isOpen = false }: AccordionItemProps) {
  const [open, setOpen] = useState(isOpen);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full py-4 flex items-center justify-between text-left group"
      >
        <span className="text-sm font-semibold text-gray-900 uppercase tracking-wider group-hover:text-[#D4AF37] transition-colors">
          {title}
        </span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-400" />
        )}
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? 'max-h-96 opacity-100 mb-4' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="text-sm text-gray-600 leading-relaxed font-light">
          {children}
        </div>
      </div>
    </div>
  );
}
