import { useCallback, useEffect, useMemo, useState } from "react";
import { CITIES, formatINRFromPaise } from "@apexdrive/shared";
import { api } from "./api";
import { getClientId } from "./storage";
import { Car, BookingSummary } from "./types";
import { Icon, IconSprite } from "./components/Icons";
import { CarCard } from "./components/CarCard";
import { Dialog } from "./components/Dialog";
import { useToast } from "./components/Toast";
import {
  Header, Hero, SearchPanel, HowItWorks, CitiesSection, Promise, Faq, Footer,
} from "./components/Sections";
import { CarDetailDialog } from "./components/CarDetailDialog";
import { BookingDialog } from "./components/BookingDialog";
import { ConfirmationDialog } from "./components/ConfirmationDialog";
import { MyBookingsDialog } from "./components/MyBookingsDialog";

type View =
  | { kind: "none" }
  | { kind: "detail"; id: string }
  | { kind: "booking"; id: string; start: string; end: string; city: string }
  | { kind: "confirmation"; booking: BookingSummary; car: Car }
  | { kind: "myBookings" }
  | { kind: "cities" }
  | { kind: "support" }
  | { kind: "terms" }
  | { kind: "privacy" };

function localDate(d: Date) {
  const adjusted = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return adjusted.toISOString().slice(0, 16);
}

export default function App() {
  const clientId = getClientId();
  const toast = useToast();

  const [cities, setCities] = useState<string[]>([...CITIES]);
  const [cars, setCars] = useState<Car[]>([]);
  const [meta, setMeta] = useState({ total: 0, limit: 6, offset: 0 });
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [view, setView] = useState<View>({ kind: "none" });
  const [loading, setLoading] = useState(true);

  // Filters (state mirrors reference)
  const [filter, setFilter] = useState({
    category: "All cars",
    brand: "",
    fuel: "",
    trans: "",
    price: 5500,
    savedOnly: false,
    sort: "recommended" as "recommended" | "price-low" | "price-high" | "rating",
    city: "",
    start: "",
    end: "",
    limit: 6,
  });
  
  const [filterOpen, setFilterOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // default dates = tomorrow 10:00 -> +3 days
  useEffect(() => {
    const t = new Date(); t.setDate(t.getDate() + 1); t.setHours(10, 0, 0, 0);
    const e = new Date(t.getTime() + 3 * 86400000);
    setFilter((f) => ({ ...f, start: localDate(t), end: localDate(e) }));
    api.cities().then(setCities).catch(() => {});
    api.saved(clientId).then((ids) => setSaved(new Set(ids))).catch(() => {});
  }, [clientId]);

  // Destructure the filter object to prevent infinite render loops
  const { category, brand, fuel, trans, price, savedOnly, sort, city, start, end, limit } = filter;

  const loadCars = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number | boolean | undefined> = {
        limit,
        offset: 0,
        sort,
        clientId,
      };
      if (category !== "All cars") params.category = category;
      if (brand) params.brand = brand;
      if (fuel) params.fuel = fuel;
      if (trans) params.trans = trans;
      if (price !== 5500) params.maxPricePaise = price * 100;
      if (savedOnly) params.savedOnly = true;
      if (city) params.city = city;
      if (start && end) { params.start = start; params.end = end; }
      
      const res = await api.cars(params);
      setCars(res.data);
      setMeta(res.meta);
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [category, brand, fuel, trans, price, savedOnly, sort, city, start, end, limit, clientId]);

  useEffect(() => { 
    loadCars(); 
  }, [loadCars]);

  const onSave = async (id: string) => {
    try {
      const isSaved = await api.toggleSaved(clientId, id);
      const next = new Set(saved);
      if (isSaved) next.add(id); else next.delete(id);
      setSaved(next);
      toast.show(isSaved ? "Saved to your list" : "Removed from saved cars");
      if (savedOnly) loadCars();
    } catch (e: any) { toast.show(e.message, true); }
  };

  const brands = useMemo(() => Array.from(new Set(cars.map((c) => c.brand))).sort(), [cars]);

  return (
    <>
      <IconSprite />
      <a className="skip-link" href="#fleet">Skip to cars</a>
      <Header
        menuOpen={menuOpen}
        onMenuToggle={() => setMenuOpen((v) => !v)}
        onMyBookings={() => setView({ kind: "myBookings" })}
        onNav={() => setMenuOpen(false)}
      />

      <main>
        <Hero />
        <SearchPanel
          cities={cities}
          start={filter.start}
          end={filter.end}
          city={filter.city}
          onCity={(v) => setFilter((f) => ({ ...f, city: v }))}
          onStart={(v) => setFilter((f) => ({ ...f, start: v }))}
          onEnd={(v) => setFilter((f) => ({ ...f, end: v }))}
          onSubmit={() => { setFilter((f) => ({ ...f, limit: 6 })); loadCars(); }}
          onError={(m) => toast.show(m, true)}
        />

        <section className="container fleet" id="fleet">
          <div className="section-header">
            <div>
              <p className="eyebrow">Find your four-wheeled match</p>
              <h2 className="section-title">A car for every plan.</h2>
              <p className="section-subtitle">Quick errands, big adventures, and everything in between.</p>
            </div>
            <button className="text-link" onClick={() => setFilter((f) => ({ ...f, limit: 100, category: "All cars" }))}>
              Explore the full fleet <Icon name="up-right" extra="icon-sm" />
            </button>
          </div>

          <div className="category-row">
            <div className="categories">
              {["All cars", "Hatchback", "SUV", "Sedan", "MPV", "Electric"].map((t) => (
                <button
                  key={t}
                  className={"category" + (filter.category === t ? " active" : "")}
                  aria-pressed={filter.category === t}
                  onClick={() => setFilter((f) => ({ ...f, category: t, limit: 6 }))}
                >
                  {t !== "All cars" && <Icon name={t === "Electric" ? "bolt" : t === "MPV" ? "users" : "car"} />}
                  {t}
                  {t === "All cars" && <span className="category-count">{meta.total}</span>}
                </button>
              ))}
            </div>
            <button
              className="btn btn-outline filter-toggle"
              aria-expanded={filterOpen}
              onClick={() => setFilterOpen((v) => !v)}
            >
              <Icon name="sliders" />
              <span className="filter-label">Filters</span>
              {(() => {
                const n = [filter.brand, filter.fuel, filter.trans, filter.price !== 5500, filter.savedOnly].filter(Boolean).length;
                return n ? <span className="filter-count">{n}</span> : null;
              })()}
            </button>
          </div>

          {filterOpen && (
            <div className="filter-panel">
              <div className="filter-control">
                <label htmlFor="brandFilter">Brand</label>
                <select id="brandFilter" value={filter.brand} onChange={(e) => setFilter((f) => ({ ...f, brand: e.target.value, limit: 6 }))}>
                  <option value="">All brands</option>
                  {brands.map((b) => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div className="filter-control">
                <label htmlFor="fuelFilter">Fuel type</label>
                <select id="fuelFilter" value={filter.fuel} onChange={(e) => setFilter((f) => ({ ...f, fuel: e.target.value, limit: 6 }))}>
                  <option value="">All fuel types</option>
                  <option>Petrol</option><option>Diesel</option><option>Electric</option>
                </select>
              </div>
              <div className="filter-control">
                <label htmlFor="transmissionFilter">Transmission</label>
                <select id="transmissionFilter" value={filter.trans} onChange={(e) => setFilter((f) => ({ ...f, trans: e.target.value, limit: 6 }))}>
                  <option value="">All transmissions</option>
                  <option>Manual</option><option>Automatic</option>
                </select>
              </div>
              <div className="filter-control">
                <label htmlFor="priceFilter">Up to ₹{filter.price.toLocaleString("en-IN")} / day</label>
                <input id="priceFilter" type="range" min={900} max={5500} step={100} value={filter.price}
                  onChange={(e) => setFilter((f) => ({ ...f, price: Number(e.target.value) }))}
                  onMouseUp={() => setFilter((f) => ({ ...f, limit: 6 }))}
                  onTouchEnd={() => setFilter((f) => ({ ...f, limit: 6 }))} />
              </div>
              <div className="filter-footer">
                <label>
                  <input type="checkbox" checked={filter.savedOnly} onChange={(e) => setFilter((f) => ({ ...f, savedOnly: e.target.checked, limit: 6 }))} />
                  Only saved cars
                </label>
                <button className="text-link" onClick={() => setFilter((f) => ({
                  ...f, category: "All cars", brand: "", fuel: "", trans: "", price: 5500, savedOnly: false, sort: "recommended", limit: 6,
                }))}>
                  Reset all filters <Icon name="x" extra="icon-sm" />
                </button>
              </div>
            </div>
          )}

          <div className="result-toolbar">
            <div className="results-copy" role="status" aria-live="polite">
              <span>Showing {cars.length} of {meta.total} cars</span>
              {filter.city ? (
                <button className="city-chip" aria-label={"Remove " + filter.city + " filter"} onClick={() => setFilter((f) => ({ ...f, city: "", limit: 6 }))}>
                  <Icon name="pin" />{filter.city}<Icon name="x" />
                </button>
              ) : (
                <><span>·</span><span>Curated for your next adventure</span></>
              )}
            </div>
            <label className="sort-control" htmlFor="sortCars">
              Sort by:
              <select id="sortCars" value={filter.sort} onChange={(e) => setFilter((f) => ({ ...f, sort: e.target.value as any }))}>
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
                <option value="rating">Top rated</option>
              </select>
            </label>
          </div>

          <div className="car-grid">
            {loading && <div className="empty-state"><p>Loading cars…</p></div>}
            {!loading && cars.length === 0 && (
              <div className="empty-state">
                <Icon name="search" />
                <h3>No cars in this lane.</h3>
                <p>Try another city or loosen a filter. Your perfect drive is still out there.</p>
                <button className="btn btn-primary" onClick={() => setFilter((f) => ({
                  ...f, category: "All cars", brand: "", fuel: "", trans: "", price: 5500, savedOnly: false, city: "", limit: 6,
                }))}>
                  Reset filters <Icon name="arrow" extra="icon-sm" />
                </button>
              </div>
            )}
            {!loading && cars.map((c) => (
              <CarCard key={c.id} car={c} saved={saved.has(c.id)} onSave={onSave} onView={(id) => setView({ kind: "detail", id })} />
            ))}
          </div>

          {meta.total > cars.length && (
            <div className="load-more-wrap">
              <button className="btn btn-outline" onClick={() => setFilter((f) => ({ ...f, limit: f.limit + 6 }))}>
                Explore {meta.total - cars.length} more cars <Icon name="arrow" extra="icon-sm" />
              </button>
            </div>
          )}
        </section>

        <HowItWorks />
        <CitiesSection onPickCity={(c) => { setFilter((f) => ({ ...f, city: c, limit: 6 })); document.getElementById("fleet")?.scrollIntoView({ behavior: "smooth" }); }} />
        <Promise onWeekend={() => {
          const now = new Date();
          const day = now.getDay();
          const friday = new Date(now);
          friday.setDate(now.getDate() + ((5 - day + 7) % 7 || 7));
          friday.setHours(10, 0, 0, 0);
          const sunday = new Date(friday.getTime() + 2 * 86400000);
          sunday.setHours(18, 0, 0, 0);
          setFilter((f) => ({ ...f, start: localDate(friday), end: localDate(sunday) }));
          document.getElementById("fleet")?.scrollIntoView({ behavior: "smooth" });
          toast.show("Weekend dates ready. Pick a car and hit the road.");
        }} />
        <Faq onSupport={() => setView({ kind: "support" })} />
      </main>

      <Footer
        onMyBookings={() => setView({ kind: "myBookings" })}
        onCityList={() => setView({ kind: "cities" })}
        onSupport={() => setView({ kind: "support" })}
        onTerms={() => setView({ kind: "terms" })}
        onPrivacy={() => setView({ kind: "privacy" })}
      />

      {view.kind === "detail" && <CarDetailDialog id={view.id} saved={saved.has(view.id)} onSave={onSave}
        onBook={(id) => setView({ kind: "booking", id, start: filter.start, end: filter.end, city: filter.city })}
        onClose={() => setView({ kind: "none" })} toast={toast.show} />}

      {view.kind === "booking" && (
        <BookingDialog
          carId={view.id}
          initialStart={view.start}
          initialEnd={view.end}
          initialCity={view.city}
          clientId={clientId}
          onClose={() => setView({ kind: "none" })}
          onConfirmed={(booking, car) => setView({ kind: "confirmation", booking, car })}
          toast={toast.show}
        />
      )}

      {view.kind === "confirmation" && (
        <ConfirmationDialog
          booking={view.booking}
          car={view.car}
          onClose={() => setView({ kind: "none" })}
          onMyBookings={() => setView({ kind: "myBookings" })}
          toast={toast.show}
        />
      )}

      {view.kind === "myBookings" && (
        <MyBookingsDialog onClose={() => setView({ kind: "none" })} toast={toast.show} />
      )}

      {view.kind === "cities" && (
        <Dialog title="15 cities. Endless road trips." compact onClose={() => setView({ kind: "none" })}>
          <p className="lookup-description">Pick a city to see cars waiting for you.</p>
          <div className="city-picker-grid">
            {cities.map((c) => (
              <button key={c} onClick={() => { setFilter((f) => ({ ...f, city: c, limit: 6 })); setView({ kind: "none" }); document.getElementById("fleet")?.scrollIntoView({ behavior: "smooth" }); }}>
                <Icon name="pin" /> {c}
              </button>
            ))}
          </div>
        </Dialog>
      )}

      {view.kind === "support" && (
        <Dialog title="Help & support" compact onClose={() => setView({ kind: "none" })}>
          <p className="lookup-description">We're here for every turn — before you leave, and if the road gets interesting.</p>
          <div className="support-options">
            <a href="mailto:hello@apexdrive.example"><Icon name="mail" /><strong>Email us</strong><span>hello@apexdrive.example</span></a>
            <a href="tel:+911800000000"><Icon name="phone" /><strong>Call support</strong><span>1800 000 0000 · 24/7</span></a>
          </div>
          <p className="demo-note"><Icon name="info" extra="icon-sm" /> This is a demonstration website. Messages won't reach a live helpdesk.</p>
        </Dialog>
      )}

      {view.kind === "terms" && (
        <Dialog title="Rental guidelines" compact onClose={() => setView({ kind: "none" })}>
          <div className="legal-content">
            <h3>Who can drive</h3>
            <p>Drivers must be 21 or older with a valid Indian driving licence. The name on the booking must match the licence shown at pick-up, along with a government photo ID.</p>
            <h3>What's included</h3>
            <p>Your fare covers the vehicle, unlimited kilometres within India, and 18% GST. There is no security deposit. Fuel or charge, tolls, parking, interstate permits, and traffic fines are paid by you.</p>
            <h3>Fuel and charge</h3>
            <p>Return the car at the same fuel or charge level as pick-up. Electric vehicles should be plugged in if a charger is provided at return.</p>
            <h3>Cancellations</h3>
            <p>Confirmed bookings can be cancelled free of charge before pick-up time from My bookings. After pick-up, the rental is non-refundable.</p>
            <h3>Care of the car</h3>
            <p>Drive courteously, stay within India, and tell us about any incident as soon as you can. Damage beyond fair wear may be charged at return.</p>
            <p>This preview does not create a live reservation or a contract of hire.</p>
          </div>
        </Dialog>
      )}

      {view.kind === "privacy" && (
        <Dialog title="Privacy policy" compact onClose={() => setView({ kind: "none" })}>
          <div className="legal-content">
            <h3>What we store</h3>
            <p>Saved cars, reviews, and bookings are stored in this application's PostgreSQL database, keyed by an anonymous per-browser ID (for saved cars) or by your mobile number (for booking lookup).</p>
            <h3>What you share</h3>
            <p>Name, email, and mobile number are used to display your booking and to let you look it up and cancel. No card or payment details are collected.</p>
            <h3>Your choices</h3>
            <p>Clearing site data in your browser changes your anonymous ID. Bookings remain findable by phone number + booking reference. You can cancel a booking before pick-up from My bookings.</p>
            <p>This is a demo; it is not a legally compliant privacy notice.</p>
          </div>
        </Dialog>
      )}

      {toast.node}
    </>
  );
}