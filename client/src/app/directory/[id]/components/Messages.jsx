//Este componente renderiza los mensajes filtrados
//y posiciona el ultimo mensaje al final

import { useEffect, useRef } from "react";

const Messages = ({ filteredMessages, userId }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [filteredMessages]);

  return (
    <div className="col-span-10 max-h-[300px] overflow-y-auto">
      {filteredMessages.map((message, index) => {
        const isSender = message.sender.id === userId;
        return (
          <div
            key={message.id || index}
            className={`mb-2 ${isSender ? "text-right" : "text-left"}`}
          >
            <div
              className={`p-3 rounded-lg ${
                isSender ? "bg-gray-200" : "bg-purple-200"
              }`}
            >
              <p>
                <strong>{isSender ? "Tú" : "Usuario"}: </strong>
                {message.sender.fullName ||
                  `${message.sender.firstName} ${message.sender.lastName}`}
              </p>
              <p>
                <strong>Mensaje: </strong>
                {message.text}
              </p>
              <p>
                <strong>Fecha: </strong>
                {message.createdAt}
              </p>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Messages;
