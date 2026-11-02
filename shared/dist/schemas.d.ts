import { z } from "zod";
export declare const cityEnum: z.ZodEnum<["Bangalore", "Delhi NCR", "Mumbai", "Hyderabad", "Chennai", "Pune", "Goa", "Jaipur", "Kolkata", "Ahmedabad", "Chandigarh", "Kochi", "Indore", "Lucknow", "Udaipur"]>;
export declare const isoDateTime: z.ZodEffects<z.ZodString, string, string>;
export declare const searchSchema: z.ZodObject<{
    city: z.ZodOptional<z.ZodEnum<["Bangalore", "Delhi NCR", "Mumbai", "Hyderabad", "Chennai", "Pune", "Goa", "Jaipur", "Kolkata", "Ahmedabad", "Chandigarh", "Kochi", "Indore", "Lucknow", "Udaipur"]>>;
    start: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    end: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    category: z.ZodOptional<z.ZodString>;
    brand: z.ZodOptional<z.ZodString>;
    fuel: z.ZodOptional<z.ZodString>;
    transmission: z.ZodOptional<z.ZodString>;
    maxPricePaise: z.ZodOptional<z.ZodNumber>;
    savedOnly: z.ZodOptional<z.ZodBoolean>;
    sort: z.ZodOptional<z.ZodEnum<["recommended", "price-low", "price-high", "rating"]>>;
    limit: z.ZodOptional<z.ZodNumber>;
    offset: z.ZodOptional<z.ZodNumber>;
    clientId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    city?: "Bangalore" | "Delhi NCR" | "Mumbai" | "Hyderabad" | "Chennai" | "Pune" | "Goa" | "Jaipur" | "Kolkata" | "Ahmedabad" | "Chandigarh" | "Kochi" | "Indore" | "Lucknow" | "Udaipur" | undefined;
    start?: string | undefined;
    end?: string | undefined;
    category?: string | undefined;
    brand?: string | undefined;
    fuel?: string | undefined;
    transmission?: string | undefined;
    maxPricePaise?: number | undefined;
    savedOnly?: boolean | undefined;
    sort?: "recommended" | "price-low" | "price-high" | "rating" | undefined;
    limit?: number | undefined;
    offset?: number | undefined;
    clientId?: string | undefined;
}, {
    city?: "Bangalore" | "Delhi NCR" | "Mumbai" | "Hyderabad" | "Chennai" | "Pune" | "Goa" | "Jaipur" | "Kolkata" | "Ahmedabad" | "Chandigarh" | "Kochi" | "Indore" | "Lucknow" | "Udaipur" | undefined;
    start?: string | undefined;
    end?: string | undefined;
    category?: string | undefined;
    brand?: string | undefined;
    fuel?: string | undefined;
    transmission?: string | undefined;
    maxPricePaise?: number | undefined;
    savedOnly?: boolean | undefined;
    sort?: "recommended" | "price-low" | "price-high" | "rating" | undefined;
    limit?: number | undefined;
    offset?: number | undefined;
    clientId?: string | undefined;
}>;
export type SearchQuery = z.infer<typeof searchSchema>;
export declare const reviewSchema: z.ZodObject<{
    name: z.ZodString;
    rating: z.ZodNumber;
    text: z.ZodString;
}, "strip", z.ZodTypeAny, {
    rating: number;
    name: string;
    text: string;
}, {
    rating: number;
    name: string;
    text: string;
}>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export declare const indianPhone: z.ZodString;
export declare const bookingSchema: z.ZodEffects<z.ZodObject<{
    clientId: z.ZodString;
    carId: z.ZodString;
    city: z.ZodEnum<["Bangalore", "Delhi NCR", "Mumbai", "Hyderabad", "Chennai", "Pune", "Goa", "Jaipur", "Kolkata", "Ahmedabad", "Chandigarh", "Kochi", "Indore", "Lucknow", "Udaipur"]>;
    start: z.ZodEffects<z.ZodString, string, string>;
    end: z.ZodEffects<z.ZodString, string, string>;
    name: z.ZodString;
    phone: z.ZodString;
    email: z.ZodString;
    acceptedTerms: z.ZodLiteral<true>;
}, "strip", z.ZodTypeAny, {
    city: "Bangalore" | "Delhi NCR" | "Mumbai" | "Hyderabad" | "Chennai" | "Pune" | "Goa" | "Jaipur" | "Kolkata" | "Ahmedabad" | "Chandigarh" | "Kochi" | "Indore" | "Lucknow" | "Udaipur";
    start: string;
    end: string;
    clientId: string;
    name: string;
    carId: string;
    phone: string;
    email: string;
    acceptedTerms: true;
}, {
    city: "Bangalore" | "Delhi NCR" | "Mumbai" | "Hyderabad" | "Chennai" | "Pune" | "Goa" | "Jaipur" | "Kolkata" | "Ahmedabad" | "Chandigarh" | "Kochi" | "Indore" | "Lucknow" | "Udaipur";
    start: string;
    end: string;
    clientId: string;
    name: string;
    carId: string;
    phone: string;
    email: string;
    acceptedTerms: true;
}>, {
    city: "Bangalore" | "Delhi NCR" | "Mumbai" | "Hyderabad" | "Chennai" | "Pune" | "Goa" | "Jaipur" | "Kolkata" | "Ahmedabad" | "Chandigarh" | "Kochi" | "Indore" | "Lucknow" | "Udaipur";
    start: string;
    end: string;
    clientId: string;
    name: string;
    carId: string;
    phone: string;
    email: string;
    acceptedTerms: true;
}, {
    city: "Bangalore" | "Delhi NCR" | "Mumbai" | "Hyderabad" | "Chennai" | "Pune" | "Goa" | "Jaipur" | "Kolkata" | "Ahmedabad" | "Chandigarh" | "Kochi" | "Indore" | "Lucknow" | "Udaipur";
    start: string;
    end: string;
    clientId: string;
    name: string;
    carId: string;
    phone: string;
    email: string;
    acceptedTerms: true;
}>;
export type BookingInput = z.infer<typeof bookingSchema>;
export declare const lookupSchema: z.ZodObject<{
    phone: z.ZodString;
}, "strip", z.ZodTypeAny, {
    phone: string;
}, {
    phone: string;
}>;
export type LookupInput = z.infer<typeof lookupSchema>;
export declare const lookupDetailSchema: z.ZodObject<{
    phone: z.ZodString;
    reference: z.ZodString;
}, "strip", z.ZodTypeAny, {
    phone: string;
    reference: string;
}, {
    phone: string;
    reference: string;
}>;
export declare const savedToggleSchema: z.ZodObject<{
    clientId: z.ZodString;
    carId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    clientId: string;
    carId: string;
}, {
    clientId: string;
    carId: string;
}>;
