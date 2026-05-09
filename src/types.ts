declare const chrome: any;

export interface AIResponse{
    summary: string;
    riskLevel: 'low' | 'medium' | 'high';
    actionType: 'review' | 'escalate' | 'ignore';
    assets: {
        name: string;
        amount: string | number;
    }[];
}

export interface TransactionData {
    hash: string;
    calldata: string;
    from: string;
    to: string;
    value?: string;
}