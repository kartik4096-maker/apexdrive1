import { Car } from "../types";
import { Icon } from "./Icons";
import { formatINRFromPaise } from "@apexdrive/shared";

interface Props {
  car: Car;
  saved: boolean;
  onSave: (id: string) => void;
  onView: (id: string) => void;
}

export function CarCard({ car, saved, onSave, onView }: Props) {
  return (
    <article className="car-card">
      <div className="car-photo">
        <img
          src={car.image}
          alt={car.name}
          loading="lazy"
          onError={(e) => {
            const el = e.currentTarget;
            if (el.dataset.fallback) {
              el.src = el.dataset.fallback;
              el.removeAttribute("data-fallback");
            }
          }}
          data-fallback={car.fallback}
        />
        <span className={"car-badge " + (car.badgeTag ?? "")}>
          <Icon name={car.badgeIcon} /> {car.badge}
        </span>
        <button
          className={"icon-button save-button" + (saved ? " saved" : "")}
          onClick={() => onSave(car.id)}
          aria-label={(saved ? "Unsave " : "Save ") + car.name}
          aria-pressed={saved}
        >
          <Icon name="heart" />
        </button>
      </div>
      <div className="car-body">
        <p className="car-type">
          {car.type} <span style={{ padding: "0 4px", color: "#bbc1b3" }}>·</span> {car.brand}
        </p>
        <div className="car-topline">
          <h3 className="car-name">{car.name}</h3>
          <span className="car-rating" aria-label={`Rated ${car.rating} out of 5`}>
            <Icon name="star" filled /> {car.rating.toFixed(1)}
          </span>
        </div>
        <div className="car-specs">
          <span><Icon name="gear" />{car.transmission}</span>
          <span><Icon name={car.fuel === "Electric" ? "bolt" : "fuel"} />{car.fuel}</span>
          <span><Icon name="users" />{car.seats} seats</span>
        </div>
        <div className="car-bottom">
          <div>
            <p className="car-price">
              {formatINRFromPaise(car.dailyPricePaise)} <span>/ day</span>
            </p>
            <p className="price-note">Unlimited kilometres · +18% GST</p>
          </div>
          <button className="btn btn-soft view-car" onClick={() => onView(car.id)}>
            View car <Icon name="up-right" />
          </button>
        </div>
      </div>
    </article>
  );
}