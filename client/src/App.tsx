import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const wsRef = useRef();

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onmessage = (ev) => {
      setMessages((m) => [...m, ev.data]);
    };
    wsRef.current = ws;
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId: "red",
          },
        })
      );
    };
  }, []);

  return (
    <main className="flex flex-col gap-3 justify-center items-center min-h-screen">
      <div className="min-w-[60vw] min-h-[80vh] border-2 border-black">
        {messages.map((message) => (
          <div>{message}</div>
        ))}
      </div>
      <div>
        <input
          className="border border-black"
          type="text"
          name="text"
          id="text"
        />
        <button
          onClick={() => {
            wsRef.current.send(
              JSON.stringify({
                type: "chat",
                payload: {
                  roomId: "red",
                  message: document.querySelector("input")?.value,
                },
              })
            );
          }}
          className="bg-black text-white"
        >
          Send message
        </button>
      </div>
    </main>
  );
}
export default App;
