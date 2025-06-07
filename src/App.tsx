import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { extensions, events } from "@neutralinojs/lib";

const BUN_EXTENSION_ID = 'js.neutralino.bun-server';

interface AppMessage {
  id: string;
  text: string;
  type: 'info' | 'error' | 'success' | 'extension-event' | 'frontend-dispatch';
}

function App() {
  const [extensionStatus, setExtensionStatus] = useState('Status: Initializing...');
  const [messages, setMessages] = useState<AppMessage[]>([]);
  const [echoInput, setEchoInput] = useState('');

  const logToUI = (text: string, type: AppMessage['type']) => {
    setMessages(prev => [...prev, { id: crypto.randomUUID(), text, type }]);
  };

  const sendPingToExtension = async () => {
    try {
      await extensions.dispatch(BUN_EXTENSION_ID, 'pingRequest', {
        message: "Ping from Neutralino React App!",
        timestamp: new Date().toISOString(),
      });
      logToUI("Frontend: 'pingRequest' dispatched to Bun extension.", "frontend-dispatch");
    } catch (err) {
      logToUI(`Frontend: Error dispatching 'pingRequest': ${(err as Error).message}`, "error");
    }
  };

  const sendEchoToExtension = async () => {
    const trimmed = echoInput.trim();
    if (!trimmed) {
      alert("Please enter data to echo.");
      return;
    }
    try {
      await extensions.dispatch(BUN_EXTENSION_ID, 'echoRequest', trimmed);
      logToUI(`Frontend: 'echoRequest' dispatched with data: "${trimmed}"`, "frontend-dispatch");
      setEchoInput('');
    } catch (err) {
      logToUI(`Frontend: Error dispatching 'echoRequest': ${(err as Error).message}`, "error");
    }
  };

  // Setup extension event listeners once
  useEffect(() => {
    const onNeutralinoReady = () => {
      setExtensionStatus("Status: Neutralino Ready. Waiting for extension events.");

      const offExtensionReady = events.on(`${BUN_EXTENSION_ID}.extensionReady`, (evt: CustomEvent<any>) => {
        console.log("extensionReady:", evt.detail);
        setExtensionStatus("Status: Bun Extension Connected & Ready!");
        logToUI(`Event from Bun: extensionReady - ${evt.detail?.message || 'No message.'}`, "success");
      });

      const offPongResponse = events.on(`${BUN_EXTENSION_ID}.pongResponse`, (evt: CustomEvent<any>) => {
        console.log("pongResponse:", evt.detail);
        logToUI(`Event from Bun: pongResponse - Original: ${JSON.stringify(evt.detail?.originalData)}, Response: ${evt.detail?.responseText}`, "extension-event");
      });

      const offEchoResponse = events.on(`${BUN_EXTENSION_ID}.echoResponse`, (evt: CustomEvent<any>) => {
        console.log("echoResponse:", evt.detail);
        logToUI(`Event from Bun: echoResponse - Original: "${evt.detail?.originalData}", Echoed by: ${evt.detail?.echoedBy}`, "extension-event");
      });

      const statusCheckTimeout = setTimeout(() => {
        extensions.dispatch(BUN_EXTENSION_ID, 'statusCheck', { appTimestamp: new Date().toISOString() })
          .catch(err => {
            if (!extensionStatus.includes("Ready!")) {
              setExtensionStatus("Status: Bun Extension might not be connected. Check extension logs.");
              console.warn("statusCheck failed:", err);
            }
          });
      }, 2000);
      const offReady = events.on('ready', onNeutralinoReady);
      return () => {
        offExtensionReady;
        offPongResponse;
        offEchoResponse;
        offReady;
        clearTimeout(statusCheckTimeout);
      };
    };

  }, []);

  const getMessageStyle = (type: AppMessage['type']) => {
    return {
      color: {
        error: 'red',
        success: 'green',
        'extension-event': 'blue',
        'frontend-dispatch': 'purple',
        info: 'black',
      }[type],
    };
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-4 font-sans">
      <img src="logo.png" alt="Sample Application Logo" className="w-24 h-24 rounded-full shadow-2xl mb-4" />

      <div className="mb-2 text-2xl font-semibold">
        App ID: {window.NL_APPID}
      </div>

      <div className="w-full max-w-2xl p-4 border border-gray-300 rounded-lg shadow-md bg-white">
        <h2 className="text-xl font-bold mb-3 text-center">Neutralino & Bun Client Extension Demo</h2>

        <div
          id="extensionStatus"
          className="mb-3 font-semibold text-center"
          style={getMessageStyle(
            extensionStatus.includes("Ready!")
              ? 'success'
              : extensionStatus.includes("might not")
                ? 'error'
                : 'info'
          )}
        >
          {extensionStatus}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <Button onClick={sendPingToExtension} className="flex-1">Send Ping to Bun Extension</Button>

          <div className="flex flex-1 gap-2">
            <input
              type="text"
              id="echoDataInput"
              placeholder="Data to echo"
              value={echoInput}
              onChange={(e) => setEchoInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendEchoToExtension()}
              className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              aria-label="Echo input"
            />
            <Button onClick={sendEchoToExtension}>Send Echo</Button>
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-2">Messages:</h3>
        <div id="extensionMessages" className="border border-gray-200 p-3 h-48 overflow-y-auto bg-gray-50 rounded-md text-sm">
          {messages.length === 0
            ? <p className="text-gray-500">No messages yet...</p>
            : messages.map((msg) => (
              <p key={msg.id} style={getMessageStyle(msg.type)} className="mb-1">
                {msg.text}
              </p>
            ))
          }
        </div>
      </div>
    </div>
  );
}

export default App;
