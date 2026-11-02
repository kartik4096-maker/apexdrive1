import type { Car, CarDetail, BookingSummary, Review } from "./types";

const BASE = (import.meta.env.VITE_API_URL as string) || "http://localhost:4000/api";

interface ApiError { error: { code: string; message: string; issues?: { path: (string|number)[]; message: string }[] } }

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(BASE + path, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  const text = await res.text();
  const body = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const err = (body as ApiError | null)?.error;
    const msg = err?.message ?? `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return body as T;
}

export const api = {
  cities: () => request<{ data: string[] }>("/cities").then((r) => r.data),

  cars: (params: Record<string, string | number | boolean | undefined>) => {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== "" && v !== false) qs.set(k, String(v));
    }
    return request<{ data: Car[]; meta: { total: number; limit: number; offset: number } }>(
      "/cars?" + qs.toString()
    );
  },

  car: (id: string) => request<{ data: CarDetail }>(`/cars/${id}`).then((r) => r.data),

  addReview: (carId: string, input: { name: string; rating: number; text: string }) =>
    request<{ data: Review }>(`/cars/${carId}/reviews`, {
      method: "POST",
      body: JSON.stringify(input),
    }).then((r) => r.data),

  saved: (clientId: string) =>
    request<{ data: string[] }>(`/saved?clientId=${encodeURIComponent(clientId)}`).then((r) => r.data),

  toggleSaved: (clientId: string, carId: string) =>
    request<{ data: { saved: boolean } }>("/saved/toggle", {
      method: "POST",
      body: JSON.stringify({ clientId, carId }),
    }).then((r) => r.data.saved),

  createBooking: (input: {
    clientId: string;
    carId: string;
    city: string;
    start: string;
    end: string;
    name: string;
    phone: string;
    email: string;
    acceptedTerms: true;
  }) =>
    request<{ data: BookingSummary }>("/bookings", {
      method: "POST",
      body: JSON.stringify(input),
    }).then((r) => r.data),

  lookupBookings: (phone: string) =>
    request<{ data: BookingSummary[] }>("/bookings/lookup", {
      method: "POST",
      body: JSON.stringify({ phone }),
    }).then((r) => r.data),

  bookingDetail: (phone: string, reference: string) =>
    request<{ data: BookingSummary }>("/bookings/detail", {
      method: "POST",
      body: JSON.stringify({ phone, reference }),
    }).then((r) => r.data),

  cancelBooking: (phone: string, reference: string) =>
    request<{ data: BookingSummary }>("/bookings/cancel", {
      method: "POST",
      body: JSON.stringify({ phone, reference }),
    }).then((r) => r.data),
};