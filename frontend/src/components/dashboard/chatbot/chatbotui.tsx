import React, { useState } from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../ui/sheet";
import { Button } from "../../ui/button";
import { BotIcon } from "../../ui/boticon";

// Placeholder for the chatbot content
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
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="default"
            size="icon-lg"
            className="fixed bottom-6 right-6 z-50 shadow-lg rounded-full bg-blue-600 hover:bg-blue-700 text-white p-0 flex items-center justify-center"
            aria-label="Open chat"
            style={{
              boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
              width: 64,
              height: 64,
            }}
          >
            <BotIcon className="w-20 h-20" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="bottom"
          className="w-full max-w-xs mx-auto flex flex-col h-[420px] rounded-t-xl p-0 mb-2"
          style={{
            right: "1.5rem",
            left: "auto",
            bottom: "5.5rem",
            position: "fixed",
          }}
        >
          <SheetHeader className="border-b p-4">
            <SheetTitle className={undefined}>Chatbot</SheetTitle>
          </SheetHeader>
          <ChatbotContent />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ChatbotUI;
