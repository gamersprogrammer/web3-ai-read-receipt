const WORKER_URL = "https://receipttranslator.michealezeonyeasi.workers.dev"; // to be replaced with actual clloudflare url
const USE_OFFLINE_MOCK = false;
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'TRANSLATE_TX') {
        const txData = request.payload;
        if (USE_OFFLINE_MOCK) {
            const mockData = {
                summary: "This transaction is a routine transfer of 100 USDC to a known address.",
                actionType: "review",
                riskLevel: "low",
                assets: [
                    { name: "USDC", amount: 100 }
                ]
            };
            setTimeout(() => sendResponse({ data: mockData }), 1000); // simulate network delay
            return true; // indicate async response
        }
        fetch(WORKER_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ calldata: txData.calldata })
        })
            .then(res => {
            if (!res.ok)
                throw new Error("Worker responsed with an error");
            return res.json();
        })
            .then(data => {
            sendResponse({ data: data });
        })
            .catch(error => {
            console.error("Fetch error", error);
            sendResponse({ error: error.message || "Network error" });
        });
        return true;
    }
});
export {};
