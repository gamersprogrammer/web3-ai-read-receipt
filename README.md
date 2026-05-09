# web3-ai-read-receipt
The biggest vulnerability in Web3 today isn't broken cryptography; it’s the user experience. Every day, users lose millions of dollars to phishing scams because they are forced to "blind sign" transactions, approving walls of unreadable hex code without actually knowing what the code does. To solve this, we built Readable Receipt, a lightweight browser extension that acts as a real-time translator and security guard, turning terrifying machine code into clear, human-readable English.

<img width="246" height="31" alt="Screenshot_9-5-2026_161710_127 0 0 1" src="https://github.com/user-attachments/assets/39ce4ab3-d8a1-4a85-ac20-5ba99472f26f" />

The tool is designed to bridge the gap between complex blockchain data and everyday users. When a user pastes their raw transaction calldata into the extension, it instantly translates the action into a simple sentence, such as "Granting Uniswap permission to spend your USDC." It also features a smart risk assessment system that color-codes the transaction's intent: green for safe transfers, yellow for standard approvals, and red for high-privilege operations commonly used by wallet drainers. For added utility, users can even generate and print clean PDF receipts of their transactions for DAO accounting or personal records.

Under the hood, Web3 AI Readable Receipt prioritizes maximum speed and absolute privacy. The vanilla TypeScript frontend passes the transaction data to a secure Cloudflare Worker edge function, which then queries Google Gemini 2.5 Flash. Acting as our AI security analyst, Gemini cross-references the addresses, decodes the hex data, and instantly returns a structured risk analysis to the user interface. Because of this serverless architecture, the user's private keys are never requested or exposed, resulting in a fast, highly secure tool essential for navigating Web3 safely.

Review receipt from AI
<img width="1366" height="768" alt="Screenshot (233)" src="https://github.com/user-attachments/assets/1b28a04a-c6a7-489f-aff3-c83367726530" />

Escalate receipt from AI - suspicious hex codes
<img width="1366" height="768" alt="Screenshot (232)" src="https://github.com/user-attachments/assets/be19bf5b-455d-4741-a39d-460c4f54c322" />

Ignore / Safe receipt from AI
<img width="1366" height="768" alt="Screenshot (234)" src="https://github.com/user-attachments/assets/035541eb-45f1-4701-ac3a-f313e26097a5" />



