import { FormEvent, useEffect, useState } from "react";
import { computePrice, formatINRFromPaise } from "@apexdrive/shared";
import { Car, BookingSummary } from "../types";
import { api } from "../api";
import { Dialog } from "./Dialog";
import { Icon } from "./Icons";

function localDate(d: Date) {
  const adjusted = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return adjusted.toISOString().slice(0, 16);
}

export function BookingDialog({
  carId, initialStart, initialEnd, initialCity, clientId, onClose, onConfirmed, toast,
}: {
  carId: string;
  initialStart: string;
  initialEnd: string;
  initialCity: string;
  clientId: string;
  onClose: () => void;
  onConfirmed: (b: BookingSummary, car: Car) => void;
  toast: (msg: string, err?: boolean) => void;
}) {
  const [car, setCar] = useState<Car | null>(null);
  const [city, setCity] = useState("");
  const [start, setStart] = useState(initialStart);
  const [end, setEnd] = useState(initialEnd);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [terms, setTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.car(carId).then((c) => {
      setCar(c);
      setCity(c.cities.includes(initialCity) ? initialCity : c.cities[0]);
      if (!initialStart || !initialEnd) {
        const t = new Date(); t.setDate(t.getDate() + 1); t.setHours(10, 0, 0, 0);
        setStart(localDate(t));
        setEnd(localDate(new Date(t.getTime() + 3 * 86400000)));
      }
    }).catch((e) => toast(e.message, true));
  }, [carId, initialCity, initialStart, initialEnd, toast]);

  if (!car) return <Dialog title="Loading…" compact onClose={onClose}><p>Loading…</p></Dialog>;

  const valid = start && end && new Date(end) > new Date(start);
  const price = valid ? computePrice(car.dailyPricePaise, start, end) : null;

    async function submit(e: FormEvent) {
    e.preventDefault();
    if (!car) return; // <--- ADD THIS LINE
    setError("");
    if (!terms) return setError("Please acknowledge the rental guidelines.");
    if (!/^[6-9]\d{9}$/.test(phone)) return setError("Enter a valid 10-digit Indian mobile number.");
    if (name.trim().length < 2) return setError("Please enter your full name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Enter a valid email address.");
    if (!valid) return setError("Please choose a valid date range.");
    setSubmitting(true);
    try {
      const b = await api.createBooking({
        clientId, carId: car.id, city, start, end,
        name: name.trim(), phone, email: email.trim(), acceptedTerms: true,
      });
      onConfirmed(b, car);
    } catch (e: any) {
      setError(e.message || "Booking failed");
        } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog title="A great drive starts here" onClose={onClose}>
      <p className="checkout-intro">
        Your trip → Your details → Let's go
      </p>
      <form onSubmit={submit}>
        <div className="checkout-layout">
          <div>
            <h3 className="checkout-section-title"><Icon name="pin" />Your trip</h3>
            <div className="form-field">
              <label htmlFor="bookingCity">Pick-up city</label>
              <select id="bookingCity" value={city} onChange={(e) => setCity(e.target.value)} required>
                {car.cities.map((c) => <option key={c}>{c}</option>)}
              </select>
              <small>Pick-up and return are in the same city.</small>
            </div>
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="bookingStart">Pick-up date & time</label>
                <input id="bookingStart" type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} min={localDate(new Date())} required />
              </div>
              <div className="form-field">
                <label htmlFor="bookingEnd">Return date & time</label>
                <input id="bookingEnd" type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} min={start} required />
              </div>
            </div>

            <h3 className="checkout-section-title" style={{ marginTop: 10 }}><Icon name="user" />A little about you</h3>
            <div className="form-field">
              <label htmlFor="bookingName">Full name</label>
              <input id="bookingName" value={name} onChange={(e) => setName(e.target.value)} placeholder="As it appears on your driving licence" autoComplete="name" required minLength={2} maxLength={70} />
            </div>
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="bookingPhone">Mobile number</label>
                <div className="phone-field">
                  <span className="phone-prefix">+91</span>
                  <input
                    id="bookingPhone" type="tel" inputMode="numeric" pattern="[6-9][0-9]{9}" maxLength={10}
                    value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="98765 43210" autoComplete="tel-national" required
                    title="Enter a 10-digit Indian mobile number starting with 6, 7, 8 or 9"
                  />
                </div>
                <small>Use this number to find your bookings.</small>
              </div>
              <div className="form-field">
                <label htmlFor="bookingEmail">Email address</label>
                <input id="bookingEmail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required maxLength={100} />
              </div>
            </div>

            <label className="check-label">
              <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} required />
              <span>
                I am 21 or older and hold a valid driving licence. I have read the{" "}
                <button type="button" className="text-link" style={{ fontSize: 10, padding: 0 }} onClick={() => setShowTerms((v) => !v)}>
                  rental guidelines
                </button>.
              </span>
            </label>
            {showTerms && (
              <p className="demo-note">
                Bring your original driving licence and government photo ID. Fuel, tolls, parking and traffic fines are not included. Return the vehicle to the same city with the same fuel or charge level. Cancellations are free before pick-up. This is a demonstration, not a live reservation.
              </p>
            )}
            {error && <div className="form-error" role="alert">{error}</div>}
            <p className="demo-note">
              <Icon name="info" extra="icon-sm" /> Preview mode: no payment is taken and no real car is reserved. Your booking is stored on our server in a demo database.
            </p>
          </div>

          <aside className="checkout-summary">
            <div className="summary-car">
              <img src={car.image} alt={car.name}
                onError={(e) => { const el = e.currentTarget; if (el.dataset.fallback) { el.src = el.dataset.fallback; el.removeAttribute("data-fallback"); } }}
                data-fallback={car.fallback} />
              <div>
                <h3>{car.name}</h3>
                <p>{car.transmission} · {car.fuel} · {car.seats} seats</p>
              </div>
            </div>
            <h4 style={{ fontSize: 12, marginBottom: 14 }}>Your trip, no surprises.</h4>
            <div aria-live="polite">
              {price ? (
                <>
                  <div className="cost-row"><span>{formatINRFromPaise(car.dailyPricePaise)} × {price.days} day{price.days === 1 ? "" : "s"}</span><strong>{formatINRFromPaise(price.subtotalPaise)}</strong></div>
                  <div className="cost-row"><span>GST (18%)</span><strong>{formatINRFromPaise(price.gstPaise)}</strong></div>
                  <div className="cost-row"><span>Security deposit</span><strong style={{ color: "#719251" }}>₹0</strong></div>
                  <div className="cost-row total"><span>Total amount</span><strong>{formatINRFromPaise(price.totalPaise)}</strong></div>
                  <p style={{ fontSize: 9, color: "#9aa58c", marginTop: 7 }}>Rental days are billed in 24-hour blocks, rounded up.</p>
                </>
              ) : (
                <p style={{ fontSize: 11, color: "#9aa58c" }}>Choose valid dates to see pricing.</p>
              )}
            </div>
            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? "Confirming…" : "Confirm booking"} {!submitting && <Icon name="arrow" extra="icon-sm" />}
            </button>
            <p className="summary-perks">Pay at pick-up · No card required</p>
            <div style={{ borderTop: "1px solid #e3e8da", marginTop: 17, paddingTop: 13, display: "grid", gap: 8 }}>
              <span className="trust-item"><Icon name="shield" />No security deposit</span>
              <span className="trust-item"><Icon name="road" />Unlimited kilometres</span>
              <span className="trust-item"><Icon name="check" />Free cancellation before pick-up</span>
            </div>
          </aside>
        </div>
      </form>
    </Dialog>
  );
}