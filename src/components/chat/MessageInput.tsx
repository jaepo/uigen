"use client";

import { ChangeEvent, FormEvent, KeyboardEvent } from "react";
import { Send } from "lucide-react";

interface MessageInputProps {
  input: string;
  handleInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export function MessageInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
}: MessageInputProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) {
        form.requestSubmit();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative p-4 border-t border-white/5">
      <div className="relative max-w-4xl mx-auto">
        <textarea
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Describe the component you want to create..."
          disabled={isLoading}
          className="w-full min-h-[80px] max-h-[200px] pl-4 pr-14 py-3.5 rounded-xl border border-white/8 bg-white/5 text-zinc-100 resize-none focus:outline-none focus:ring-1 focus:ring-violet-500/40 focus:border-violet-500/40 transition-all placeholder:text-zinc-600 text-sm"
          rows={3}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="absolute right-3 bottom-3 p-2 rounded-lg transition-all bg-violet-600 hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-violet-600"
        >
          <Send className="h-3.5 w-3.5 text-white" />
        </button>
      </div>
    </form>
  );
}