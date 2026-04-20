// components/ui/EditableText.tsx
"use client";
import { useCVStore } from "@/store/useCVStore";

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  isMultiline?: boolean;
}

export default function EditableText({
  value,
  onChange,
  placeholder,
  className,
  isMultiline = false,
}: EditableTextProps) {
  const { isEditMode } = useCVStore();

  if (!isEditMode) {
    return (
      <span className={className}>
        {value ||
          (placeholder && <span className="opacity-30">{placeholder}</span>)}
      </span>
    );
  }

  if (isMultiline) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`bg-slate-500/10 hover:bg-slate-500/20 focus:bg-white focus:text-slate-900 outline-none rounded transition-colors resize-none overflow-hidden block w-full ${className}`}
        rows={3}
      />
    );
  }

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`bg-slate-500/10 hover:bg-slate-500/20 focus:bg-white focus:text-slate-900 outline-none rounded px-1 transition-colors w-full ${className}`}
    />
  );
}
