export declare const GST_RATE_PERCENT = 18;
export declare function rupeesToPaise(rupees: number): number;
export declare function paiseToRupees(paise: number): number;
export declare function formatINRFromPaise(paise: number): string;
export declare const DAY_MS = 86400000;
export declare function tripDays(startISO: string, endISO: string): number;
export interface PriceBreakdown {
    days: number;
    dailyPricePaise: number;
    subtotalPaise: number;
    gstPaise: number;
    totalPaise: number;
}
export declare function computePrice(dailyPricePaise: number, startISO: string, endISO: string): PriceBreakdown;
