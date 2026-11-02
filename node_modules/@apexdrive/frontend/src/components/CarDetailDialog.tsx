import { useEffect, useState, FormEvent } from "react";
import { CarDetail, Review } from "../types";
import { api } from "../api";
import { Dialog } from "./Dialog";
import { Icon } from "./Icons";
import { formatINRFromPaise } from "@apexdrive/shared";

export function CarDetailDialog({
  id, saved, onSave, onBook, onClose, toast,
}: {
  id: string;
  saved: boolean;
  onSave: (id: string) => void;
  onBook: (id: string) => void;
  onClose: () => void;
  toast: (msg: string, err?: boolean) => void;
}) {
  const [car, setCar] = useState<CarDetail | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.car(id).then(setCar).catch((e) => toast(e.message, true));
  }, [id, toast]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return toast("Please add your name.", true);
    if (text.trim().length < 10) return toast("Please add a review of at least 10 characters.", true);
    setSubmitting(true);
    try {
      await api.addReview(id, { name: name.trim(), rating, text: text.trim() });
      const fresh = await api.car(id);
      setCar(fresh);
      setName(""); setText(""); setRating(5); setShowForm(false);
      toast("Thanks for sharing your drive!");
    } catch (e: any) {
      toast(e.message, true);
    } finally {
      setSubmitting(false);
    }
  };

  if (!car) {
    return <Dialog title="Loading car…" compact onClose={onClose}><p>Loading…</p></Dialog>;
  }

  const avg = car.reviewCount === 0 ? 0 : car.reviews.reduce((s, r) => s + r.rating, 0) / car.reviews.length;

  return (
    <Dialog title="Meet your next drive" onClose={onClose}>
      <div className="detail-hero">
        <div className="detail-photo">
          <img src={car.image} alt={car.name}
            onError={(e) => { const el = e.currentTarget; if (el.dataset.fallback) { el.src = el.dataset.fallback; el.removeAttribute("data-fallback"); } }}
            data-fallback={car.fallback} />
          <span className="photo-disclaimer">{car.name} · Studio photography · Colour and variant may differ at pick-up</span>
        </div>
        <div>
          <p className="detail-label">{car.brand} · {car.type}</p>
          <h3 className="detail-heading">{car.name}</h3>
          <div className="detail-rating">
            <Icon name="star" filled /><strong>{avg.toFixed(1)}</strong>
            <span>· {car.reviews.length} traveller reviews</span>
          </div>
          <p className="detail-description">{car.description}</p>
          <div className="detail-booking">
            <div>
              <p className="car-price">{formatINRFromPaise(car.dailyPricePaise)} <span>/ day</span></p>
              <p className="price-note">Unlimited kilometres · +18% GST</p>
            </div>
            <button className="btn btn-primary" onClick={() => onBook(car.id)}>Book this car <Icon name="arrow" extra="icon-sm" /></button>
          </div>
        </div>
      </div>

      <section className="detail-section">
        <h3>The little details</h3>
        <div className="spec-grid">
          {[
            ["gear", "Transmission", car.transmission],
            [car.fuel === "Electric" ? "bolt" : "fuel", "Fuel type", car.fuel],
            ["users", "Seats", car.seats + " people"],
            ["speed", car.fuel === "Electric" ? "Range" : "Mileage", car.mileage],
            ["car", car.fuel === "Electric" ? "Battery" : "Engine", car.engine],
            ["bag", "Luggage", car.bags + " bags"],
          ].map(([icon, label, value]) => (
            <div className="spec-box" key={label}>
              <Icon name={icon} /><span>{label}</span><strong>{value}</strong>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 9, color: "#a0a995", marginTop: 10 }}>
          Manufacturer-claimed efficiency. Real-world figures vary with conditions. Features are variant-dependent.
        </p>
      </section>

      <section className="detail-section">
        <h3>Good things, included.</h3>
        <div className="feature-chips">
          {[...car.features, "Unlimited kilometres", "24/7 roadside support"].map((f) => (
            <span className="feature-chip" key={f}><Icon name="check" />{f}</span>
          ))}
        </div>
      </section>

      <section className="detail-section">
        <h3>Find it in {car.cities.length} cities</h3>
        <div className="city-tags">{car.cities.map((c) => <span key={c}>{c}</span>)}</div>
      </section>

      <section className="detail-section">
        <div className="review-heading">
          <h3>From the driver's seat <span style={{ fontSize: 11, color: "#9ba58f", fontWeight: 400 }}>({car.reviews.length})</span></h3>
          <button className="btn btn-outline btn-small" onClick={() => setShowForm((v) => !v)}>
            Write a review <Icon name="plus" extra="icon-sm" />
          </button>
        </div>
        {showForm && (
          <form className="review-form" onSubmit={submit}>
            <div className="review-form-grid">
              <div className="form-field">
                <label htmlFor="reviewName">Your name</label>
                <input id="reviewName" value={name} onChange={(e) => setName(e.target.value)} minLength={2} maxLength={40} required placeholder="e.g. Aditi S." autoComplete="name" />
              </div>
              <div className="form-field">
                <label>Your rating</label>
                <div className="rating-picker" role="group" aria-label="Star rating">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} type="button" className={n <= rating ? "selected" : ""} onClick={() => setRating(n)} aria-label={`${n} star${n > 1 ? "s" : ""}`} aria-pressed={n === rating}>
                      <Icon name="star" filled />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="form-field">
              <label htmlFor="reviewText">How was your drive?</label>
              <textarea id="reviewText" value={text} onChange={(e) => setText(e.target.value)} required minLength={10} maxLength={600} placeholder="Share a little about your experience…" />
              <small>Reviews are saved on our servers. Please don't share personal contact details.</small>
            </div>
            <button className="btn btn-primary btn-small" type="submit" disabled={submitting}>
              {submitting ? "Posting…" : "Post review"} {!submitting && <Icon name="arrow" extra="icon-sm" />}
            </button>
          </form>
        )}
        <div className="review-grid">
          {car.reviews.map((r: Review) => (
            <article className="review-card" key={r.id}>
              <div className="review-card-head">
                <strong>{r.name}</strong>
                <span className="review-stars" aria-label={`${r.rating} out of 5 stars`}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Icon key={n} name="star" filled style={{ opacity: n <= r.rating ? 1 : 0.2 }} />
                  ))}
                </span>
              </div>
              <p>{r.text}</p>
              <div className="review-date">
                {new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · Traveller review
              </div>
            </article>
          ))}
        </div>
      </section>
    </Dialog>
  );
}