import { BookingSummary, Car } from "../types";
import { Dialog } from "./Dialog";
import { Icon } from "./Icons";
import { formatINRFromPaise } from "@apexdrive/shared";

export function ConfirmationDialog({
  booking, car, onClose, onMyBookings, toast,
}: {
  booking: BookingSummary;
  car: Car;
  onClose: () => void;
  onMyBookings: () => void;
  toast: (msg: string, err?: boolean) => void;
}) {
  const copy = () => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(booking.reference)
        .then(() => toast("Reference copied"))
        .catch(() => toast("Reference: " + booking.reference));
    } else toast("Reference: " + booking.reference);
  };
  const firstName = booking.name?.split(" ")[0] ?? "";
  return (
    <Dialog title="You're going places" compact onClose={onClose}>
      <div className="confirmation-head">
        <div className="confirmation-icon"><Icon name="check" /></div>
        <h3>You're all set.</h3>
        <p>Your self-drive is confirmed. See you on the road{firstName ? `, ${firstName}` : ""}.</p>
      </div>
      <div className="reference-box">
        <div>
          <span>Booking reference</span>
          <strong>{booking.reference}</strong>
        </div>
        <button className="icon-button" aria-label="Copy reference" onClick={copy}>
          <Icon name="copy" />
        </button>
      </div>
      <div className="confirmation-trip">
        <div className="summary-car">
          <img src={car.image} alt={car.name}
            onError={(e) => { const el = e.currentTarget; if (el.dataset.fallback) { el.src = el.dataset.fallback; el.removeAttribute("data-fallback"); } }}
            data-fallback={car.fallback} />
          <div>
            <h3>{car.name}</h3>
            <p>{booking.city} · {car.transmission} · {car.fuel}</p>
          </div>
        </div>
        <div className="trip-dates">
          <div>
            <label>Pick-up</label>
            <strong>{new Date(booking.start).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</strong>
            <p>{new Date(booking.start).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true })}</p>
          </div>
          <div>
            <label>Return</label>
            <strong>{new Date(booking.end).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</strong>
            <p>{new Date(booking.end).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true })}</p>
          </div>
        </div>
        <div className="cost-row total" style={{ margin: 0 }}>
          <span>{booking.days} day{booking.days === 1 ? "" : "s"} · incl. GST</span>
          <strong>{formatINRFromPaise(booking.totalPaise)}</strong>
        </div>
      </div>
      <p className="demo-note"><Icon name="info" extra="icon-sm" /> Preview booking. Bring your original driving licence and photo ID at pick-up. Pay the total amount there — no card was charged.</p>
      <div className="confirmation-actions">
        <button className="btn btn-primary" onClick={onMyBookings}>View my bookings <Icon name="bag" extra="icon-sm" /></button>
        <button className="btn btn-outline" onClick={onClose}>Keep browsing</button>
      </div>
    </Dialog>
  );
}