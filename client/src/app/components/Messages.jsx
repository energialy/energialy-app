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

  // Scroll automático también cuando se monta el componente
  useEffect(() => {
    scrollToBottom();
  }, []);

  return (
    <div className="h-full overflow-y-auto p-4 bg-gray-50">
      {filteredMessages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <p className="text-sm">No hay mensajes para mostrar</p>
            <p className="text-xs mt-1">Envía el primer mensaje para comenzar la conversación</p>
          </div>
        </div>
      ) : (
        filteredMessages.map((message, index) => {
          const isSender = message.sender.id === userId;
          const userName = message.sender.fullName ||
            `${message.sender.firstName} ${message.sender.lastName}`;
          
          return (
            <div
              key={message.id || index}
              className={`mb-4 ${isSender ? "text-right" : "text-left"}`}
            >
              {/* Nombre del usuario */}
              <div className={`text-xs text-gray-600 mb-1 ${isSender ? "text-right" : "text-left"}`}>
                {userName}
              </div>
              
              {/* Mensaje */}
              <div
                className={`text-sm p-3 rounded-lg inline-block max-w-[70%] shadow-sm ${
                  isSender 
                    ? "bg-blue-500 text-white rounded-br-none" 
                    : "bg-white text-gray-900 border border-gray-200 rounded-bl-none"
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
        })
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Messages;
