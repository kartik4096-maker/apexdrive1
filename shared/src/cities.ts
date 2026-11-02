export const CITIES = [
  "Bangalore",
  "Delhi NCR",
  "Mumbai",
  "Hyderabad",
  "Chennai",
  "Pune",
  "Goa",
  "Jaipur",
  "Kolkata",
  "Ahmedabad",
  "Chandigarh",
  "Kochi",
  "Indore",
  "Lucknow",
  "Udaipur",
] as const;

export type City = (typeof CITIES)[number];