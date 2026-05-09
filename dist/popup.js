let input = null;
let btn = null;
let resultCard = null;
let badge = null;
let summary = null;
let assets = null;
let printBtn = null;
let fromInput = null;
let toInput = null;
document.addEventListener('DOMContentLoaded', () => {
    input = document.getElementById('tx-input');
    btn = document.getElementById('translate-btn');
    resultCard = document.getElementById('result-card');
    badge = document.getElementById('badge');
    summary = document.getElementById('summary');
    assets = document.getElementById('assets');
    printBtn = document.getElementById('print-btn');
    fromInput = document.getElementById('from-input');
    toInput = document.getElementById('to-input');
    if (btn) {
        btn.addEventListener('click', async () => {
            const calldata = (input && input.value) ? input.value.trim() : '';
            if (!calldata)
                return;
            btn.disabled = true;
            btn.innerText = "Translating...";
            if (resultCard) {
                resultCard.style.display = 'none';
                resultCard.className = '';
            }
            const txData = {
                hash: crypto.randomUUID(),
                calldata: calldata,
                from: fromInput?.value.trim() || "0xsender",
                to: toInput?.value.trim() || "contract_address",
            };
            try {
                // runtime `chrome` may not be typed in this project; runtime call still works in extension
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                chrome.runtime.sendMessage({ action: 'TRANSLATE_TX', payload: txData }, (response) => {
                    btn.disabled = false;
                    btn.innerText = "Translate Transaction";
                    if (resultCard)
                        resultCard.style.display = 'block';
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    if ((chrome && chrome.runtime && chrome.runtime.lastError) || response.error) {
                        if (badge)
                            badge.innerText = 'Error';
                        if (summary)
                            summary.innerText = response.error || 'An error occurred while processing the transaction.';
                        if (resultCard)
                            resultCard.classList.add('state-escalate');
                        return;
                    }
                    if (response.data) {
                        renderReceipt(response.data);
                    }
                });
            }
            catch (err) {
                btn.disabled = false;
                btn.innerText = "Translate Transaction";
                console.error('sendMessage failed', err);
                if (badge)
                    badge.innerText = 'Error';
                if (summary)
                    summary.innerText = 'Failed to send message to background.';
                if (resultCard)
                    resultCard.classList.add('state-escalate');
            }
        });
    }
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            // In extension popups `window.print()` may not reliably open the print dialog
            // because the popup can close. Open a new tab/window with printable content instead.
            try {
                const printable = resultCard ? resultCard.innerHTML : document.body.innerHTML;
                const w = window.open('', '_blank', 'noopener,noreferrer');
                if (w && w.document) {
                    w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Print</title></head><body>${printable}</body></html>`);
                    w.document.close();
                    w.focus();
                    w.print();
                }
                else {
                    window.print();
                }
            }
            catch (err) {
                console.error('Print failed, falling back to window.print()', err);
                try {
                    window.print();
                }
                catch (e) { }
            }
        });
    }
    else {
        console.warn('print-btn not found in DOM');
    }
});
function renderReceipt(data) {
    if (!resultCard || !badge || !summary || !assets || !printBtn)
        return;
    resultCard.classList.add(`state-${data.actionType}`);
    badge.innerText = data.actionType === 'ignore' ? 'Safe / Routine' : data.actionType;
    summary.innerText = data.summary;
    if (data.assets && data.assets.length > 0) {
        assets.innerHTML = "<strong>Assets Involved:</strong><br>" +
            data.assets.map(a => `${a.amount} of ${a.name}`).join('<br>');
    }
    else {
        assets.innerHTML = "";
    }
    // printBtn.style.display = "block"
}
export {};
