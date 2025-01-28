"use client";
import React, { useState } from "react";
import ChatInput from "../_components/chat-input";
import { api } from "@/trpc/react";
import { type DetectIntentResponse } from "../models/chat.models";

const Dashboard: React.FC = () => {
  const [messages, setMessages] = useState<{ sender: "user" | "system"; text: string }[]>([]);
  const [pendingSlots, setPendingSlots] = useState<string[]>([]);
  const [extractedSlots, setExtractedSlots] = useState<Record<string, string>>({});
  const [isTyping, setIsTyping] = useState<boolean>(false); // Typing effect state

  const detectIntentMutation = api.chat.detectIntent.useMutation();
  const extractSlotsMutation = api.chat.extractSlots.useMutation();
  const identifyMissingSlotsMutation = api.chat.identityMissingSlots.useMutation();
  const handleIntentMutation = api.chat.handleIntent.useMutation();
  const generateResponseMutation = api.chat.generateResponse.useMutation();
  const getRequiredSlotsMutation = api.chat.getRequiredSlots.useMutation();

  const addMessage = (sender: "user" | "system", text: string) => {
    setMessages((prev) => [...prev, { sender, text }]);
  };

  const handleSubmit = async (message: string) => {
    addMessage("user", message);
    setIsTyping(true); // Show typing animation

    try {
      const detectedIntent: DetectIntentResponse = await detectIntentMutation.mutateAsync({
        message,
      });

      const extractedSlotsResult = await extractSlotsMutation.mutateAsync({
        message,
      });

      setExtractedSlots((prev) => ({
        ...prev,
        ...extractedSlotsResult,
      }));

      const requiredSlots = await getRequiredSlotsMutation.mutateAsync({
        intent: detectedIntent,
      });

      const missingSlots = await identifyMissingSlotsMutation.mutateAsync({
        extractedSlots: { ...extractedSlots, ...extractedSlotsResult },
        requiredSlots: requiredSlots,
      });

      if (missingSlots.length > 0) {
        setPendingSlots(missingSlots);
        addMessage("system", `Please provide: ${missingSlots.join(", ")}`);
        setIsTyping(false); // Hide typing animation
        return;
      }

      const recommendations = await handleIntentMutation.mutateAsync({
        intent: detectedIntent,
        slots: { ...extractedSlots, ...extractedSlotsResult },
      });

      const response = await generateResponseMutation.mutateAsync({
        userQuery: message,
        jsonData: { recommendations },
      });

      addMessage("system", response);
    } catch (error) {
      console.error("Error processing message:", error);
      addMessage("system", "An error occurred. Please try again.");
    } finally {
      setIsTyping(false); // Hide typing animation
    }
  };

  const handlePendingSlotInput = async (slot: string, value: string) => {
    setExtractedSlots((prev) => ({ ...prev, [slot]: value }));
    setPendingSlots((prev) => prev.filter((s) => s !== slot));

    if (pendingSlots.length === 1) {
      await handleSubmit("Here is the updated slot data.");
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-b from-[#15B392] via-[#54C392] to-[#D2FF72]">
      <div className="flex flex-1 flex-col bg-white p-4">
        <div className="flex-1 overflow-y-auto rounded-lg bg-[#F3F3F3] p-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`mb-2 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
              <div
                className={`inline-block rounded-lg px-4 py-2 ${msg.sender === "user" ? "bg-[#15B392] text-white" : "bg-gray-200 text-black"
                  }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {/* Typing Indicator */}
          {isTyping && (
            <div className="mb-2 text-left">
              <div className="inline-block rounded-lg px-4 py-2 bg-gray-200 text-black">
                <TypingDots />
              </div>
            </div>
          )}
        </div>

        {pendingSlots.length > 0 && (
          <div className="mt-4">
            {pendingSlots.map((slot, idx) => (
              <div key={idx} className="mb-2 flex items-center">
                <label className="mr-2 font-bold">{slot}:</label>
                <input
                  type="text"
                  className="flex-1 rounded border px-2 py-1"
                  onKeyDown={async (e) => {
                    if (e.key === "Enter") {
                      await handlePendingSlotInput(slot, (e.target as HTMLInputElement).value);
                    }
                  }}
                />
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center">
          <ChatInput onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

// TypingDots Component
const TypingDots: React.FC = () => {
  return (
    <div className="flex space-x-1">
      <span className="inline-block w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
      <span className="inline-block w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "200ms" }}></span>
      <span className="inline-block w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "400ms" }}></span>
    </div>
  );
};

export default Dashboard;
