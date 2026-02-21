import React, { useState } from "react";
import { Button } from "../../ui/button";
import { BotIcon } from "../../ui/boticon";

// Chatbot content
function ChatbotContent() {
  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex-1 overflow-y-auto">
        Chatbot conversation goes here.
      </div>
      <div className="mt-4">
        <input
          type="text"
          className="w-full border rounded px-3 py-2 text-sm"
          placeholder="Type your message..."
        />
      </div>
    </div>
  );
}

const ChatbotUI: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button
        variant="default"
        size="icon-lg"
        className="fixed bottom-20 right-6 z-[60] shadow-lg rounded-full bg-blue-600 hover:bg-blue-700 text-white p-0 flex items-center justify-center md:bottom-6"
        aria-label={open ? "Close chat" : "Open chat"}
        style={{
          boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
          width: 64,
          height: 64,
        }}
        onClick={() => setOpen((prev) => !prev)}
      >
        <BotIcon className="w-20 h-20" />
      </Button>

      <div
        className="fixed bottom-20 right-6 z-50 flex items-end justify-end pointer-events-none md:bottom-6"
        style={{ width: 64, height: 64 }}
      >
        <div
          className={`bg-white shadow-xl rounded-xl overflow-hidden flex flex-col transition-all duration-300 ease-in-out ${
            open
              ? "scale-100 opacity-100 pointer-events-auto"
              : "scale-0 opacity-0"
          }`}
          style={{
            width: 340,
            height: 420,
            position: "absolute",
            bottom: 80,
            right: 0,
            transformOrigin: "bottom right",
          }}
        >
          <div className="border-b p-4 flex justify-between items-center">
            <span className="font-bold text-lg">Chatbot</span>
          </div>
          <ChatbotContent />
        </div>
      </div>
    </div>
  );
};

export default ChatbotUI;
