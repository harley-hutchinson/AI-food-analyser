import EvieMessage from "@/components/Core/EvieMessage";
import EvieTyping from "@/components/Core/EvieTyping";

interface ChatMessagesProps {
  step: number;
  hasApiKey: boolean;
  isLoading: boolean;
}

export default function ChatMessages({
  step,
  hasApiKey,
  isLoading,
}: ChatMessagesProps) {
  return (
    <>
      {/* Initial Typing */}
      {step === 0 && <EvieTyping />}

      {/* Evie Messages */}
      {step >= 1 && step < 99 && (
        <>
          {hasApiKey ? (
            <EvieMessage>
              I'm your AI nutrition assistant. Just send me a photo of your food
              and I’ll break it down for you.
            </EvieMessage>
          ) : (
            <EvieMessage>
              Welcome! 🎉 To get started, you'll need to add your Gemini API
              key. Please head to Settings ⚙️ and enter your key — then come
              back here!
            </EvieMessage>
          )}
        </>
      )}

      {/* Extra Instruction if has API key */}
      {step >= 2 && step < 99 && hasApiKey && (
        <EvieMessage>
          Want to take a picture right now, or choose one from your gallery?
          📷🖼️
        </EvieMessage>
      )}

      {/* Post-analysis message */}
      {step === 99 && (
        <EvieMessage>
          Want to scan another meal? I’m ready when you are 🍽️
        </EvieMessage>
      )}

      {/* Loading messages */}
      {isLoading && (
        <>
          <EvieMessage>Analyzing your image… hang tight!</EvieMessage>
          <EvieTyping />
        </>
      )}
    </>
  );
}
