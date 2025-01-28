"use client";
import { PaperAirplaneIcon, PaperClipIcon } from "@heroicons/react/16/solid";
import React, { useState, type ChangeEvent, type KeyboardEvent } from "react";

interface ChatInputProps {
  onSubmit: (message: string) => Promise<void>;
  onAttach?: () => void;
  placeholder?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSubmit,
  onAttach,
  placeholder = "Type a message...",
}) => {
  const [text, setText] = useState<string>("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setText(e.target.value);
  };

  const handleKeyPress = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      await handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (text.trim()) {
      await onSubmit(text);
      setText("");
    }
  };

  const handleAttach = (): void => {
  };

  return (
    <div className="flex w-full max-w-full items-center rounded-full border border-gray-300 bg-white p-4 shadow-sm">
      {/* Attach Button */}
      <button
        type="button"
        className="mr-2 text-gray-500 transition-colors hover:text-[#73ec8b]"
        onClick={handleAttach}
      >
        <PaperClipIcon className="h-[2rem] w-[2em]" />
      </button>

      {/* Input Field */}
      <input
        type="text"
        className="text-md flex-1 bg-transparent px-2 text-black placeholder-gray-400 outline-none"
        value={text}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
      />

      {/* Submit Button */}
      <button
        type="button"
        className="ml-2 text-gray-500 transition-colors hover:text-[#73ec8b]"
        onClick={handleSubmit}
      >
        <PaperAirplaneIcon className="h-[2rem] w-[2rem]" />
      </button>
    </div>
  );
};

export default ChatInput;
