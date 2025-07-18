//Este componente renderiza los mensajes filtrados
//y posiciona el ultimo mensaje al final

import { useEffect, useRef } from "react";

const Messages = ({ filteredMessages, userId }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "auto",
        block: "nearest",
        inline: "nearest",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [filteredMessages]);

  return (
    <div className="col-span-10 max-h-[300px] overflow-y-auto">
      {filteredMessages.map((message, index) => {
        const isSender = message.sender.id === userId;
        const userName = message.sender.fullName ||
          `${message.sender.firstName} ${message.sender.lastName}`;
        
        return (
          <div
            key={message.id || index}
            className={`mb-3 ${isSender ? "text-right" : "text-left"}`}
          >
            {/* Nombre del usuario */}
            <div className={`text-xs text-gray-600 mb-1 ${isSender ? "text-right" : "text-left"}`}>
              {userName}
            </div>
            
            {/* Mensaje */}
            <div
              className={`text-sm p-3 rounded-lg inline-block max-w-[70%] ${
                isSender ? "bg-gray-200" : "bg-purple-200"
              }`}
            >
              {message.text}
            </div>
            
            {/* Fecha */}
            <div className={`text-xs text-gray-500 mt-1 ${isSender ? "text-right" : "text-left"}`}>
              {message.createdAt}
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Messages;
