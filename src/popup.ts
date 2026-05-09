import {  AIResponse, TransactionData } from "./types";

let input: HTMLTextAreaElement | null = null;
let btn: HTMLButtonElement | null = null;
let resultCard: HTMLDivElement | null = null;
let badge: HTMLDivElement | null = null;
let summary: HTMLDivElement | null = null;
let assets: HTMLDivElement | null = null;
let printBtn: HTMLButtonElement | null = null;
let fromInput: HTMLTextAreaElement | null = null;
let toInput: HTMLTextAreaElement | null = null;

document.addEventListener('DOMContentLoaded', () => {
    input = document.getElementById('tx-input') as HTMLTextAreaElement | null;
    btn = document.getElementById('translate-btn') as HTMLButtonElement | null;
    resultCard = document.getElementById('result-card') as HTMLDivElement | null;
    badge = document.getElementById('badge') as HTMLDivElement | null;
    summary = document.getElementById('summary') as HTMLDivElement | null;
    assets = document.getElementById('assets') as HTMLDivElement | null;
    printBtn = document.getElementById('print-btn') as HTMLButtonElement | null;
    fromInput = document.getElementById('from-input') as HTMLTextAreaElement | null;
    toInput = document.getElementById('to-input') as HTMLTextAreaElement | null;

    if (btn){
        btn.addEventListener('click', async () => {
            const calldata = (input && input.value) ? input.value.trim() : '';
            if (!calldata) return;

            btn!.disabled = true;
            btn!.innerText = "Translating...";
            if (resultCard) {
                resultCard.style.display = 'none';
                resultCard.className = '';
            }

            const txData: TransactionData = {
                hash: crypto.randomUUID(),
                calldata: calldata,
                from: fromInput?.value.trim() || "0xsender",
                to: toInput?.value.trim() || "contract_address",
            };

            try {
                // runtime `chrome` may not be typed in this project; runtime call still works in extension
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                chrome.runtime.sendMessage({action: 'TRANSLATE_TX', payload: txData}, (response: {data?: AIResponse, error?: string}) => {
                    btn!.disabled = false;
                    btn!.innerText = "Translate Transaction";
                    if (resultCard) resultCard.style.display = 'block';

                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    if ((chrome && chrome.runtime && chrome.runtime.lastError) || response.error){
                        if (badge) badge.innerText = 'Error';
                        if (summary) summary.innerText = response.error || 'An error occurred while processing the transaction.';
                        if (resultCard) resultCard.classList.add('state-escalate');
                        return;
                    }

                    if (response.data){
                        renderReceipt(response.data);
                    }
                });
            } catch (err) {
                btn!.disabled = false;
                btn!.innerText = "Translate Transaction";
                console.error('sendMessage failed', err);
                if (badge) badge.innerText = 'Error';
                if (summary) summary.innerText = 'Failed to send message to background.';
                if (resultCard) resultCard.classList.add('state-escalate');
            }
        });
    }

    if (printBtn){
        printBtn.addEventListener('click', () => {
            // In extension popups `window.print()` may not reliably open the print dialog
            // because the popup can close. Open a new tab/window with printable content instead.
            try {
                const printable = resultCard ? resultCard.innerHTML : document.body.innerHTML;
                const w = window.open('', '_blank', 'noopener,noreferrer');
                if (w && w.document){
                    w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Print</title></head><body>${printable}</body></html>`);
                    w.document.close();
                    w.focus();
                    w.print();
                } else {
                    window.print();
                }
            } catch (err) {
                console.error('Print failed, falling back to window.print()', err);
                try { window.print(); } catch(e){}
            }
        });
    } else {
        console.warn('print-btn not found in DOM');
    }
});

function renderReceipt(data: AIResponse){
    if (!resultCard || !badge || !summary || !assets || !printBtn) return;

    resultCard.classList.add(`state-${data.actionType}`);

    badge.innerText = data.actionType === 'ignore' ? 'Safe / Routine' : data.actionType;
    summary.innerText = data.summary;

    if (data.assets && data.assets.length > 0){
        assets.innerHTML = "<strong>Assets Involved:</strong><br>" + 
            data.assets.map(a => `${a.amount} of ${a.name}`).join('<br>');

    } else{
        assets.innerHTML = "";
    }
    // printBtn.style.display = "block"
}