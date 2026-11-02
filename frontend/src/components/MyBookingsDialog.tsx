import { FormEvent, useState } from "react";
import { BookingSummary } from "../types";
import { api } from "../api";
import { Dialog } from "./Dialog";
import { Icon } from "./Icons";
import { formatINRFromPaise } from "@apexdrive/shared";

export function MyBookingsDialog({
  onClose, toast,
}: {
  onClose: () => void;
  toast: (msg: string, err?: boolean) => void;
}) {
  const [phone, setPhone] = useState("");
  const [rows, setRows] = useState<BookingSummary[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [looked, setLooked] = useState(false);
  const [pendingCancel, setPendingCancel] = useState<string | null>(null);

  async function lookup(e?: FormEvent) {
    e?.preventDefault();
    if (!/^[6-9]\d{9}$/.test(phone)) return toast("Enter a valid 10-digit mobile number.", true);
    setLoading(true);
    try {
      const result = await api.lookupBookings(phone);
      setRows(result);
      setLooked(true);
    } catch (e: any) {
      toast(e.message, true);
    } finally {
      setLoading(false);
    }
  }

  async function doCancel(reference: string) {
    try {
      await api.cancelBooking(phone, reference);
      toast("Booking cancelled");
      setPendingCancel(null);
      await lookup();
    } catch (e: any) {
      toast(e.message, true);
    }
  }

  async function copyRef(ref: string) {
    if (navigator.clipboard?.writeText) {
      try { await navigator.clipboard.writeText(ref); toast("Reference copied"); }
      catch { toast("Reference: " + ref); }
    } else toast("Reference: " + ref);
  }

  return (
    <Dialog title="My bookings" compact onClose={onClose}>
      <p className="lookup-description">
        Enter the mobile number used at booking to find your trips. For privacy, only masked summaries appear —
        to see details or cancel, you'll need the booking reference too.
      </p>
      <form className="lookup-form" onSubmit={lookup}>
        <div className="form-field">
          <label htmlFor="lookupPhone">Mobile number</label>
          <div className="phone-field">
            <span className="phone-prefix">+91</span>
            <input
              id="lookupPhone" type="tel" inputMode="numeric" placeholder="98765 43210" maxLength={10}
              value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} required
            />
          </div>
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Searching…" : "Find trips"} {!loading && <Icon name="search" />}
        </button>
      </form>
      <p className="lookup-help">Tip: use the same 10-digit number you booked with.</p>

      <div className="booking-results">
        {looked && rows && rows.length === 0 && (
          <div className="empty-state">
            <Icon name="search" />
            <h3>No bookings found.</h3>
            <p>We couldn't find any trips for this number.</p>
          </div>
        )}
        {rows?.map((b) => {
          const canCancel = b.status === "confirmed" && new Date(b.start) > new Date();
          return (
            <article className="booking-item" key={b.reference}>
              <div className="booking-item-top">
                <span className="booking-item-ref">{b.reference}</span>
                <span className={"status" + (b.status === "cancelled" ? " cancelled" : "")}>
                  {b.status === "cancelled" ? "Cancelled" : "Confirmed"}
                </span>
              </div>
              <div className="summary-car">
                <div>
                  <h3>{b.carId}</h3>
                  <p>{b.city} · {new Date(b.start).toLocaleDateString("en-IN")} – {new Date(b.end).toLocaleDateString("en-IN", { year: "numeric" })}</p>
                </div>
              </div>
              <div className="booking-item-actions">
                <strong>{formatINRFromPaise(b.totalPaise)}</strong>
                <div>
                  <button className="btn btn-outline btn-small" onClick={() => copyRef(b.reference)}>
                    Copy <Icon name="copy" extra="icon-sm" />
                  </button>
                  {canCancel && (
                    <button className="btn btn-soft btn-small" onClick={() => setPendingCancel(pendingCancel === b.reference ? null : b.reference)}>
                      Cancel
                    </button>
                  )}
                </div>
              </div>
              {pendingCancel === b.reference && (
                <div className="cancel-confirm">
                  Cancel this trip for free? The car will be released back to the fleet.
                  <div>
                    <button className="btn btn-outline btn-small" onClick={() => setPendingCancel(null)}>Keep booking</button>
                    <button className="btn btn-primary btn-small" onClick={() => doCancel(b.reference)}>Yes, cancel</button>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
      <p className="demo-note">
        <Icon name="info" extra="icon-sm" /> Demo verification: knowing the phone number only reveals
        masked summaries. Details and cancellation require the reference as well. This is not
        production-grade identity verification.
      </p>
    </Dialog>
  );
}