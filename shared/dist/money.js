// All money in the API/DB is stored as integer paise.
export const GST_RATE_PERCENT = 18;
export function rupeesToPaise(rupees) {
    return Math.round(rupees * 100);
}
export function paiseToRupees(paise) {
    return paise / 100;
}
export function formatINRFromPaise(paise) {
    const rupees = paise / 100;
    return "₹" + new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(rupees));
}
export const DAY_MS = 86_400_000;
// Billing days = ceil((end - start) / 24h), minimum 1.
export function tripDays(startISO, endISO) {
    const diff = new Date(endISO).getTime() - new Date(startISO).getTime();
    if (!Number.isFinite(diff) || diff <= 0)
        return 0;
    return Math.max(1, Math.ceil(diff / DAY_MS));
}
export function computePrice(dailyPricePaise, startISO, endISO) {
    const days = tripDays(startISO, endISO);
    const subtotalPaise = dailyPricePaise * days;
    const gstPaise = Math.round((subtotalPaise * GST_RATE_PERCENT) / 100);
    return { days, dailyPricePaise, subtotalPaise, gstPaise, totalPaise: subtotalPaise + gstPaise };
}
