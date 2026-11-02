import { FormEvent } from "react";
import { Icon } from "./Icons";
import { CITIES } from "@apexdrive/shared";

export function Header({
  menuOpen,
  onMenuToggle,
  onMyBookings,
  onNav,
}: {
  menuOpen: boolean;
  onMenuToggle: () => void;
  onMyBookings: () => void;
  onNav: () => void;
}) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="logo" href="#top" aria-label="ApexDrive home">
          <span className="logo-mark">
            <svg viewBox="0 0 32 32" aria-hidden="true">
              <path fill="#fff" d="M3 26 13 6h6l10 20h-7l-6-13-6 13H3Z" />
              <path fill="#fff" d="m14.5 22 1.5-3 1.5 3Z" />
            </svg>
          </span>
          <span>ApexDrive<span className="logo-dot">.</span></span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a className="active" href="#fleet">Browse cars</a>
          <a href="#how-it-works">How it works</a>
          <a href="#why-apex">Why ApexDrive</a>
        </nav>
        <div className="header-actions">
          <button className="btn btn-outline booking-nav" onClick={onMyBookings}>
            <Icon name="bag" /> My bookings
          </button>
          <button className="mobile-toggle" aria-label="Open menu" aria-expanded={menuOpen} onClick={onMenuToggle}>
            <Icon name="menu" />
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav className="mobile-nav open" aria-label="Mobile navigation" onClick={onNav}>
          <a href="#fleet">Browse cars</a>
          <a href="#how-it-works">How it works</a>
          <a href="#why-apex">Why ApexDrive</a>
          <a href="#destinations">Explore cities</a>
        </nav>
      )}
    </header>
  );
}

export function Hero() {
  return (
    <section className="hero" aria-labelledby="heroTitle">
      <div className="hero-visual">
        <img src="https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1800&q=90" alt="A white SUV ready for an open-road adventure" fetchPriority="high" />
      </div>
      <div className="container hero-inner">
        <div className="hero-kicker"><Icon name="road" /> SELF-DRIVE. SELF-DISCOVER.</div>
        <h1 id="heroTitle">
          Your journey.<br />Your <span>kind of drive.</span>
        </h1>
        <p className="hero-description">
          From everyday escapes to the long way home.<br />
          Find your perfect self-drive car, across India.
        </p>
        <div className="hero-proof">
          <div className="avatar-stack" aria-hidden="true">
            <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80" alt="" />
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80" alt="" />
            <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=80&h=80&q=80" alt="" />
          </div>
          <div>
            <div className="proof-stars" aria-label="Rated 4.9 out of 5">
              <Icon name="star" filled /><Icon name="star" filled /><Icon name="star" filled /><Icon name="star" filled /><Icon name="star" filled />
              <strong>4.9/5</strong>
            </div>
            <p className="proof-copy">Good drives. Even better memories.</p>
          </div>
        </div>
      </div>
      <div className="hero-note">
        <div className="hero-note-icon"><Icon name="leaf" /></div>
        <div>
          <strong>A little freedom goes a long way.</strong>
          <span>No driver. No rush. Just you and the road.</span>
        </div>
      </div>
    </section>
  );
}

export function SearchPanel({
  cities, start, end, city, onCity, onStart, onEnd, onSubmit, onError,
}: {
  cities: string[];
  start: string; end: string; city: string;
  onCity: (v: string) => void; onStart: (v: string) => void; onEnd: (v: string) => void;
  onSubmit: () => void; onError: (m: string) => void;
}) {
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!start || !end) return onError("Choose valid pick-up and return dates.");
    if (new Date(start).getTime() < Date.now()) return onError("Your pick-up time needs to be in the future.");
    if (new Date(end) <= new Date(start)) return onError("Return time must be after pick-up time.");
    onSubmit();
  }
  return (
    <div className="container search-wrap">
      <form className="search-panel" onSubmit={handleSubmit}>
        <div className="search-field">
          <label className="search-label" htmlFor="searchCity"><Icon name="pin" />Pick-up city</label>
          <select id="searchCity" value={city || cities[0]} onChange={(e) => onCity(e.target.value)}>
            {cities.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="search-field">
          <label className="search-label" htmlFor="searchStart"><Icon name="calendar" />Pick-up date & time</label>
          <input id="searchStart" type="datetime-local" value={start} onChange={(e) => onStart(e.target.value)} required />
        </div>
        <div className="search-field">
          <label className="search-label" htmlFor="searchEnd"><Icon name="calendar" />Return date & time</label>
          <input id="searchEnd" type="datetime-local" value={end} onChange={(e) => onEnd(e.target.value)} required />
        </div>
        <button className="btn btn-primary search-button" type="submit">Find my drive <Icon name="arrow" /></button>
      </form>
      <div className="trust-strip">
        <span className="trust-item"><Icon name="shield" />No security deposit</span><span className="trust-dot" />
        <span className="trust-item"><Icon name="road" />Unlimited kilometres</span><span className="trust-dot" />
        <span className="trust-item"><Icon name="clock" />24/7 roadside support</span><span className="trust-dot" />
        <span className="trust-item"><Icon name="sparkles" />Clean & ready to go</span>
      </div>
    </div>
  );
}

export function HowItWorks() {
  return (
    <section className="how-section" id="how-it-works">
      <div className="container">
        <div className="center-heading">
          <p className="eyebrow">Less planning. More going.</p>
          <h2 className="section-title">Three steps. One open road.</h2>
          <p className="section-subtitle">Getting away should be the easy part.</p>
        </div>
        <div className="steps">
          {[
            { icon: "search", n: "01", t: "Find your perfect match", p: "Pick your city and dates. Find a car that feels like your kind of adventure." },
            { icon: "calendar", n: "02", t: "Make it yours", p: "A few details and you're booked. Clear pricing, no last-minute surprises." },
            { icon: "key", n: "03", t: "Keys in. World out.", p: "Pick up your car, queue your playlist, and take the road that calls you." },
          ].map((s) => (
            <div className="step" key={s.n}>
              <div className="step-icon"><Icon name={s.icon} /><span className="step-number">{s.n}</span></div>
              <h3>{s.t}</h3>
              <p>{s.p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CitiesSection({ onPickCity }: { onPickCity: (c: string) => void }) {
  const featured = [
    { name: "Bangalore", tag: "From city streets to coffee trails", img: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&q=80", alt: "Bangalore's historic architecture" },
    { name: "Goa", tag: "Take the scenic way to the beach", img: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80", alt: "Palm-lined Goan coast" },
    { name: "Mumbai", tag: "City lights, mountain escapes", img: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80", alt: "The Gateway of India in Mumbai" },
    { name: "Delhi NCR", tag: "A gateway to your next adventure", img: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80", alt: "India Gate in New Delhi" },
  ];
  return (
    <section className="container cities-section" id="destinations">
      <div className="section-header">
        <div>
          <p className="eyebrow">15 cities. Countless possibilities.</p>
          <h2 className="section-title">Where will you go next?</h2>
          <p className="section-subtitle">Your next story could start right here.</p>
        </div>
      </div>
      <div className="city-grid">
        {featured.map((c) => (
          <button key={c.name} className="city-card" data-city={c.name} aria-label={`Explore cars in ${c.name}`} onClick={() => onPickCity(c.name)}>
            <img src={c.img} alt={c.alt} loading="lazy" />
            <span className="city-caption">
              <span><h3>{c.name}</h3><p>{c.tag}</p></span>
              <Icon name="up-right" />
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

export function Promise({ onWeekend }: { onWeekend: () => void }) {
  return (
    <section className="container promise-wrap" id="why-apex">
      <div className="promise">
        <img className="promise-image" src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85" alt="A car parked beside a peaceful tree-lined road" loading="lazy" />
        <p className="eyebrow">The ApexDrive promise</p>
        <h2 className="section-title">All the freedom.<br />None of the fuss.</h2>
        <p className="promise-text">The best journeys aren't complicated. Neither is renting with us. Just good cars and peace of mind.</p>
        <div className="promise-features">
          <span><Icon name="check" />Transparent, all-day pricing</span>
          <span><Icon name="check" />Well-maintained cars</span>
          <span><Icon name="check" />Free cancellation before pick-up</span>
          <span><Icon name="check" />Support that goes the extra mile</span>
        </div>
        <button className="btn btn-primary" onClick={onWeekend}>Find your weekend ride <Icon name="arrow" extra="icon-sm" /></button>
        <span className="promise-stamp"><Icon name="road" />Made for the long way home</span>
      </div>
    </section>
  );
}

export function Faq({ onSupport }: { onSupport: () => void }) {
  const items = [
    ["What do I need to rent a car?", "You must be at least 21 years old and bring your original, valid Indian driving licence and a government-issued photo ID. The booking name must match the licence presented at pick-up."],
    ["Are there any hidden charges or deposits?", "Your summary shows the daily rental, number of rental days, and 18% GST before you confirm. There is no security deposit. Fuel, tolls, parking, traffic fines, and any damage are not included in the rental price."],
    ["Is there a limit on how far I can drive?", "All listed rentals include unlimited kilometres. Take your time and enjoy the journey. Vehicles must remain within India, and any interstate permits or tolls are your responsibility."],
    ["What if my plans change?", "You can cancel a confirmed booking for free before its pick-up time. Open My bookings, enter the mobile number used to book, and select Cancel booking. To change dates or vehicles, cancel and make a new booking."],
    ["How does the fuel policy work?", "Return the car with the same fuel level as at pick-up. Electric vehicles should be returned with the same charge level. Fuel and charging costs during your trip are paid by you."],
  ];
  return (
    <section className="container faq-section">
      <div className="faq-layout">
        <div className="faq-intro">
          <p className="eyebrow">Before you hit the road</p>
          <h2 className="section-title">A few things you might be wondering.</h2>
          <p>A little clarity goes a long way.</p>
          <button className="text-link" onClick={onSupport}>
            Still have a question? Let's talk <Icon name="arrow" extra="icon-sm" />
          </button>
        </div>
        <div className="faq-list">
          {items.map(([q, a]) => (
            <details key={q}>
              <summary>{q}<Icon name="plus" /></summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Footer({
  onMyBookings, onCityList, onSupport, onTerms, onPrivacy,
}: {
  onMyBookings: () => void; onCityList: () => void; onSupport: () => void;
  onTerms: () => void; onPrivacy: () => void;
}) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-brand">
            <a className="logo" href="#top">
              <span className="logo-mark">
                <svg viewBox="0 0 32 32" aria-hidden="true">
                  <path fill="#fff" d="M3 26 13 6h6l10 20h-7l-6-13-6 13H3Z" />
                  <path fill="#fff" d="m14.5 22 1.5-3 1.5 3Z" />
                </svg>
              </span>
              <span>ApexDrive<span className="logo-dot">.</span></span>
            </a>
            <p className="footer-tagline">Good cars. Open roads. Your own way.<br />Self-drive rentals made for real life.</p>
            <p className="india-note"><span className="flag-dots" aria-hidden="true"><i></i><i></i><i></i></span>Made for India. Made for the journey.</p>
          </div>
          <div className="footer-col">
            <h4>Explore</h4>
            <a href="#fleet">Browse cars</a>
            <button onClick={onCityList}>Our cities</button>
            <a href="#how-it-works">How it works</a>
            <a href="#why-apex">Why ApexDrive</a>
          </div>
          <div className="footer-col">
            <h4>Here to help</h4>
            <button onClick={onMyBookings}>My bookings</button>
            <button onClick={onSupport}>Help & support</button>
            <button onClick={onTerms}>Rental guidelines</button>
            <button onClick={onPrivacy}>Privacy policy</button>
          </div>
          <div className="footer-col">
            <h4>Let's stay in touch</h4>
            <a href="mailto:hello@apexdrive.example">hello@apexdrive.example</a>
            <p style={{ fontSize: 10, color: "#899180", lineHeight: 1.8 }}>For every turn in your journey.</p>
            <button className="support-badge" onClick={onSupport}>Your road-trip companion</button>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} ApexDrive. All roads welcome.</span>
          <span>Demo · Bookings are stored in this app's database</span>
          <div className="footer-bottom-links">
            <button onClick={onPrivacy}>Privacy</button>
            <button onClick={onTerms}>Terms of use</button>
          </div>
        </div>
      </div>
    </footer>
  );
}