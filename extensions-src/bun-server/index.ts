type ConnectParams = {
    nlPort: string;
    nlToken: string;
    nlConnectToken: string;
    nlExtensionId: string;
};

async function main() {
    console.log("starting!");

    try {
        let raw = '';
        for await (const chunk of Bun.stdin.stream()) {
            raw += Buffer.from(chunk).toString();
        }

        const params: ConnectParams = JSON.parse(raw);
        console.log("params:", params);

        const wsUrl = `ws://localhost:${params.nlPort}?extensionId=${params.nlExtensionId}&connectToken=${params.nlConnectToken}`;
        console.log("Connecting to:", wsUrl);

        const socket = new WebSocket(wsUrl);

        socket.onopen = () => {
            console.log("✅ Connected to Neutralino");

            setInterval(() => {
                const msg = {
                    id: crypto.randomUUID(),
                    method: "app.broadcast",
                    accessToken: params.nlToken,
                    data: {
                        event: "fromExtension",
                        data: {
                            message: "📡 Hello from Bun!",
                        },
                    },
                };
                // console.log("📨 Sending:", msg);
                socket.send(JSON.stringify(msg));
            }, 10000);
        }

        socket.onmessage = (e: any) => {
            const msg = JSON.parse(e.data);
            console.log("📨 Received:", msg);

            if (msg.action === "ping") {
                socket.send(JSON.stringify({
                    id: msg.id,
                    action: "pong",
                    data: "Hello from Bun!",
                }));
            }
            if (msg.event === 'windowClose' || msg.event === 'appClose') {
                process.exit(0);
            }
        };

        socket.onclose = () => {
            console.log("⚠️ WebSocket closed");
            process.exit(0);
        };

        socket.onerror = (err) => {
            console.error("❌ WebSocket error", err);
        };

    } catch (err) {
        console.error("🚫 Failed to initialize extension:", err);
    }
}

main();

function randomUUID() {
    throw new Error("Function not implemented.");
}
