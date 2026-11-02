import { PrismaClient } from "@prisma/client";
import { CITIES, rupeesToPaise } from "@apexdrive/shared";

const prisma = new PrismaClient();

type CarSeed = {
  id: string; name: string; brand: string; type: string; fuel: string;
  transmission: string; seats: number; priceRupees: number; mileage: string;
  engine: string; bags: number; cities: readonly string[] | string[];
  image: string; fallback: string; badge: string; badgeIcon: string;
  tag?: string; description: string; features: string[];
};

const ALL = CITIES;
const MAJOR = CITIES.slice(0, 10);
const SUV_CITIES = ["Bangalore","Delhi NCR","Mumbai","Hyderabad","Pune","Goa","Jaipur","Chandigarh","Kochi","Udaipur"];
const ELECTRIC = ["Bangalore","Delhi NCR","Mumbai","Hyderabad","Pune","Chennai"];

const stock = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;
const official = (make: string, model: string) =>
  `https://cdn.imagin.studio/getImage?customer=img&make=${encodeURIComponent(make)}&modelFamily=${encodeURIComponent(model)}&angle=23&width=1200&zoomType=fullscreen&countryCode=IN`;

const CARS: CarSeed[] = [
  { id:"swift", name:"Maruti Swift", brand:"Maruti Suzuki", type:"Hatchback", fuel:"Petrol", transmission:"Manual", seats:5, priceRupees:1200, mileage:"24.8 km/l", engine:"1,197 cc", bags:2, cities:[...ALL], image:official("suzuki","swift"), fallback:stock("photo-1549317661-bd32c8ce0db2"), badge:"City favourite", badgeIcon:"sparkles", tag:"orange", description:"Light on its feet and easy on your pocket. The Swift makes city errands and spontaneous escapes feel equally effortless.", features:["Air conditioning","Bluetooth audio","Rear parking sensors","USB charging"] },
  { id:"creta", name:"Hyundai Creta", brand:"Hyundai", type:"SUV", fuel:"Diesel", transmission:"Automatic", seats:5, priceRupees:2600, mileage:"19.1 km/l", engine:"1,493 cc", bags:3, cities:[...MAJOR,"Chandigarh","Kochi"], image:official("hyundai","creta"), fallback:stock("photo-1609521263047-f8f205293f24"), badge:"Most loved", badgeIcon:"heart", description:"Space to stretch out, comfort to settle into. A refined automatic SUV for family getaways and the long, scenic route.", features:["Panoramic sunroof","Cruise control","Wireless charging","Rear camera","Apple CarPlay"] },
  { id:"thar", name:"Mahindra Thar", brand:"Mahindra", type:"SUV", fuel:"Diesel", transmission:"Manual", seats:4, priceRupees:3200, mileage:"15.2 km/l", engine:"2,184 cc", bags:2, cities:[...SUV_CITIES], image:official("mahindra","thar"), fallback:stock("photo-1533473359331-0135ef1b58bf"), badge:"Weekend ready", badgeIcon:"road", description:"A proper adventure companion with unmistakable character. For winding hills, unforgettable views, and a little less ordinary.", features:["4-wheel drive","Hard top","Cruise control","Touchscreen audio","Hill hold assist"] },
  { id:"city", name:"Honda City", brand:"Honda", type:"Sedan", fuel:"Petrol", transmission:"Automatic", seats:5, priceRupees:2200, mileage:"18.4 km/l", engine:"1,498 cc", bags:3, cities:[...MAJOR,"Lucknow","Indore"], image:official("honda","city"), fallback:stock("photo-1618843479313-40f8afb4b4d8"), badge:"Comfort first", badgeIcon:"sparkles", description:"A little extra room and a lot of refinement. A smooth, spacious sedan that turns everyday journeys into something special.", features:["Sunroof","Cruise control","Rear AC vents","Rear camera","Apple CarPlay"] },
  { id:"nexon", name:"Tata Nexon", brand:"Tata", type:"SUV", fuel:"Petrol", transmission:"Automatic", seats:5, priceRupees:2200, mileage:"17.4 km/l", engine:"1,199 cc", bags:3, cities:[...ALL], image:official("tata","nexon"), fallback:stock("photo-1606664515524-ed2f786a0bd6"), badge:"An all-rounder", badgeIcon:"shield", tag:"orange", description:"Confident, comfortable, and ready for your plans. A compact SUV with room for friends and everything the weekend needs.", features:["6 airbags","Touchscreen audio","Rear camera","Hill hold assist","Android Auto"] },
  { id:"xuv700", name:"Mahindra XUV700", brand:"Mahindra", type:"SUV", fuel:"Diesel", transmission:"Automatic", seats:7, priceRupees:3500, mileage:"16.6 km/l", engine:"2,184 cc", bags:4, cities:[...SUV_CITIES,"Chennai","Kolkata"], image:official("mahindra","xuv700"), fallback:stock("photo-1519641471654-76ce0107ad1b"), badge:"Bring everyone", badgeIcon:"users", description:"Big plans deserve a little more space. A seven-seat SUV with premium comforts, made for the whole crew.", features:["Panoramic sunroof","Cruise control","Dual-zone climate","360° camera","Wireless charging"] },
  { id:"baleno", name:"Maruti Baleno", brand:"Maruti Suzuki", type:"Hatchback", fuel:"Petrol", transmission:"Manual", seats:5, priceRupees:1400, mileage:"22.4 km/l", engine:"1,197 cc", bags:2, cities:[...ALL], image:official("suzuki","baleno"), fallback:stock("photo-1471444928139-48c5bf5173f8"), badge:"Smart city choice", badgeIcon:"car", description:"Easy to park, roomy inside, and happy to go the distance. An everyday hatchback that makes a great weekend companion.", features:["Air conditioning","Apple CarPlay","Rear camera","USB charging"] },
  { id:"i20", name:"Hyundai i20", brand:"Hyundai", type:"Hatchback", fuel:"Petrol", transmission:"Automatic", seats:5, priceRupees:1600, mileage:"19.6 km/l", engine:"1,197 cc", bags:2, cities:[...MAJOR,"Kochi","Chandigarh"], image:official("hyundai","i20"), fallback:stock("photo-1541899481282-d53bffe3c35d"), badge:"Small car, big comfort", badgeIcon:"sparkles", description:"A premium hatchback with effortless automatic driving. A great fit for busy city streets and relaxed highway runs.", features:["Touchscreen audio","Rear camera","Cruise control","Android Auto"] },
  { id:"tiago", name:"Tata Tiago", brand:"Tata", type:"Hatchback", fuel:"Petrol", transmission:"Manual", seats:5, priceRupees:1000, mileage:"20.1 km/l", engine:"1,199 cc", bags:2, cities:[...ALL], image:official("tata","tiago"), fallback:stock("photo-1550355291-bbee04a92027"), badge:"Easy on the wallet", badgeIcon:"wallet", tag:"orange", description:"Compact, cheerful, and practical. Everything you need for an easy day out, without a bigger bill.", features:["Air conditioning","Bluetooth audio","Parking sensors","USB charging"] },
  { id:"wagonr", name:"Maruti Wagon R", brand:"Maruti Suzuki", type:"Hatchback", fuel:"Petrol", transmission:"Manual", seats:5, priceRupees:900, mileage:"24.4 km/l", engine:"998 cc", bags:2, cities:[...ALL], image:official("suzuki","wagon-r"), fallback:stock("photo-1489824904134-891ab64532f1"), badge:"Best value", badgeIcon:"wallet", tag:"orange", description:"A sensible city favourite with surprising space. Comfortable, economical, and ready for the everyday.", features:["Air conditioning","Bluetooth audio","Parking sensors","Power windows"] },
  { id:"verna", name:"Hyundai Verna", brand:"Hyundai", type:"Sedan", fuel:"Petrol", transmission:"Automatic", seats:5, priceRupees:2400, mileage:"19.6 km/l", engine:"1,497 cc", bags:3, cities:[...MAJOR,"Chandigarh"], image:official("hyundai","verna"), fallback:stock("photo-1617531653332-bd46c24f2068"), badge:"Arrive in style", badgeIcon:"sparkles", description:"Sharp design meets relaxed driving. A modern sedan for workday journeys and stylish escapes.", features:["Sunroof","Ventilated seats","Cruise control","Wireless charging","Rear camera"] },
  { id:"ciaz", name:"Maruti Ciaz", brand:"Maruti Suzuki", type:"Sedan", fuel:"Petrol", transmission:"Manual", seats:5, priceRupees:1800, mileage:"20.7 km/l", engine:"1,462 cc", bags:3, cities:[...MAJOR,"Lucknow","Indore"], image:official("suzuki","ciaz"), fallback:stock("photo-1621007947382-bb3c3994e3fb"), badge:"Room to relax", badgeIcon:"users", description:"Plenty of legroom and a calm, comfortable ride. A great-value sedan for longer journeys.", features:["Rear AC vents","Cruise control","Rear camera","Bluetooth audio"] },
  { id:"fortuner", name:"Toyota Fortuner", brand:"Toyota", type:"SUV", fuel:"Diesel", transmission:"Automatic", seats:7, priceRupees:5500, mileage:"14.4 km/l", engine:"2,755 cc", bags:4, cities:["Bangalore","Delhi NCR","Mumbai","Hyderabad","Pune","Goa","Jaipur","Chandigarh"], image:official("toyota","fortuner"), fallback:stock("photo-1544636331-e26879cd4d9b"), badge:"Go big", badgeIcon:"road", description:"Powerful presence and seven-seat comfort. The Fortuner makes every long-distance journey feel like an occasion.", features:["4-wheel drive","Cruise control","Leather upholstery","Powered tailgate","Rear camera"] },
  { id:"seltos", name:"Kia Seltos", brand:"Kia", type:"SUV", fuel:"Diesel", transmission:"Automatic", seats:5, priceRupees:2800, mileage:"19.1 km/l", engine:"1,493 cc", bags:3, cities:[...MAJOR,"Kochi","Chandigarh"], image:official("kia","seltos"), fallback:stock("photo-1605559424843-9e4c228bf1c2"), badge:"A crowd favourite", badgeIcon:"heart", description:"Style, space, and a smooth automatic drive. For travellers who like a little more from their everyday SUV.", features:["Panoramic sunroof","Ventilated seats","360° camera","Wireless charging","Cruise control"] },
  { id:"brezza", name:"Maruti Brezza", brand:"Maruti Suzuki", type:"SUV", fuel:"Petrol", transmission:"Manual", seats:5, priceRupees:2000, mileage:"17.4 km/l", engine:"1,462 cc", bags:3, cities:[...ALL], image:official("suzuki","brezza"), fallback:stock("photo-1619767886558-efdc259cde1a"), badge:"Ready for anything", badgeIcon:"car", description:"A practical compact SUV with plenty of personality. Comfortable in the city and confident beyond it.", features:["Sunroof","Rear camera","Cruise control","Apple CarPlay"] },
    { id:"scorpio", name:"Mahindra Scorpio N", brand:"Mahindra", type:"SUV", fuel:"Diesel", transmission:"Manual", seats:7, priceRupees:3400, mileage:"15.9 km/l", engine:"2,184 cc", bags:4, cities:[...SUV_CITIES,"Lucknow","Indore"], image:official("mahindra","scorpio-n"), fallback:stock("photo-1485291571150-772bcfc10da5"), badge:"Adventure, upgraded", badgeIcon:"road", description:"A commanding SUV for big families and bigger plans. The open road feels right at home here.", features:["Sunroof","Dual-zone climate","Cruise control","Rear camera","Hill hold assist"] },
  { id:"ertiga", name:"Maruti Ertiga", brand:"Maruti Suzuki", type:"MPV", fuel:"Petrol", transmission:"Manual", seats:7, priceRupees:2000, mileage:"20.5 km/l", engine:"1,462 cc", bags:4, cities:[...ALL], image:official("suzuki","ertiga"), fallback:stock("photo-1464219782435-57baab892294"), badge:"Family favourite", badgeIcon:"users", description:"Bring the family and leave the compromises behind. Flexible seven-seat space with sensible running costs.", features:["Rear AC vents","Flexible seating","Bluetooth audio","Parking sensors"] },
  { id:"innova", name:"Toyota Innova Crysta", brand:"Toyota", type:"MPV", fuel:"Diesel", transmission:"Manual", seats:7, priceRupees:3800, mileage:"15.6 km/l", engine:"2,393 cc", bags:4, cities:[...MAJOR,"Kochi","Chandigarh","Udaipur"], image:official("toyota","innova"), fallback:stock("photo-1449965408869-eaa3f722e40d"), badge:"The long-trip legend", badgeIcon:"road", description:"A road-trip favourite for a reason. Generous space and reassuring comfort for the entire family.", features:["Captain seats","Rear AC vents","Cruise control","Rear camera","Touchscreen audio"] },
  { id:"carens", name:"Kia Carens", brand:"Kia", type:"MPV", fuel:"Diesel", transmission:"Automatic", seats:7, priceRupees:2600, mileage:"18.4 km/l", engine:"1,493 cc", bags:4, cities:[...MAJOR,"Kochi"], image:official("kia","carens"), fallback:stock("photo-1549399542-7e3f8b79c341"), badge:"Space for your people", badgeIcon:"users", description:"Thoughtful comfort in every row. A modern family mover built for shared memories.", features:["6 airbags","Roof-mounted AC","Sunroof","Rear camera","USB-C charging"] },
  { id:"nexonev", name:"Tata Nexon EV", brand:"Tata", type:"Electric", fuel:"Electric", transmission:"Automatic", seats:5, priceRupees:2800, mileage:"465 km claimed", engine:"40.5 kWh", bags:3, cities:[...ELECTRIC,"Kochi"], image:official("tata","nexon-ev"), fallback:stock("photo-1593941707882-a5bac6861d75"), badge:"Go a little greener", badgeIcon:"bolt", tag:"green", description:"Quiet streets, instant response, and a different kind of road trip. Discover the easy side of electric driving.", features:["Fast charging","Regenerative braking","Connected navigation","Rear camera","6 airbags"] },
  { id:"mgzs", name:"MG ZS EV", brand:"MG", type:"Electric", fuel:"Electric", transmission:"Automatic", seats:5, priceRupees:3500, mileage:"461 km claimed", engine:"50.3 kWh", bags:3, cities:[...ELECTRIC], image:official("mg","zs-ev"), fallback:stock("photo-1560958089-b8a1929cea89"), badge:"Electric, elevated", badgeIcon:"bolt", tag:"green", description:"A refined electric SUV with plenty of range for your plans. Less noise, more of the journey.", features:["Panoramic sunroof","Fast charging","360° camera","Cruise control","Connected navigation"] },
];

const SEED_REVIEWS = [
  { names: ["Rohan M.","Priya S.","Arjun K.","Neha R.","Aditya P.","Meera D."],
    messages: [
      "Easy pick-up and a spotless car. We took the scenic route all weekend and loved every minute of it.",
      "The car was comfortable and the pricing was clear. A really smooth experience from start to finish.",
      "Just what we needed for a quick getaway. Plenty of room for our bags and a lovely drive.",
      "Simple booking and a great car. Would happily choose this again for our next trip.",
    ],
  },
];

async function main() {
  // Cities
  const cityMap = new Map<string, number>();
  for (const name of CITIES) {
    const c = await prisma.city.upsert({ where: { name }, update: {}, create: { name } });
    cityMap.set(name, c.id);
  }

  // Cars
  for (let i = 0; i < CARS.length; i++) {
    const c = CARS[i];
    const data = {
      id: c.id,
      name: c.name,
      brand: c.brand,
      type: c.type,
      fuel: c.fuel,
      transmission: c.transmission,
      seats: c.seats,
      bags: c.bags,
      dailyPricePaise: rupeesToPaise(c.priceRupees),
      mileage: c.mileage,
      engine: c.engine,
      description: c.description,
      badge: c.badge,
      badgeIcon: c.badgeIcon,
      badgeTag: c.tag ?? null,
      image: c.image,
      fallback: c.fallback,
      features: c.features,
    };
    await prisma.car.upsert({
      where: { id: c.id },
      update: data,
      create: data,
    });

    // cities
    for (const cityName of c.cities) {
      const cityId = cityMap.get(cityName);
      if (!cityId) continue;
      await prisma.carCity.upsert({
        where: { carId_cityId: { carId: c.id, cityId } },
        update: {},
        create: { carId: c.id, cityId },
      });
    }
  }

  // Seed starter reviews (once per car) so initial ratings match reference.
  for (let i = 0; i < CARS.length; i++) {
    const c = CARS[i];
    const existing = await prisma.review.count({ where: { carId: c.id } });
    if (existing > 0) continue;
    const { names, messages } = SEED_REVIEWS[0];
    for (let n = 0; n < 2; n++) {
      await prisma.review.create({
        data: {
          carId: c.id,
          name: names[(i + n) % names.length],
          rating: n === 0 || i % 3 === 1 ? 5 : 4,
          text: messages[(i + n) % messages.length],
          createdAt: new Date(Date.now() - (8 + i + n * 11) * 86_400_000),
        },
      });
    }
  }

  console.log(`Seeded ${CITIES.length} cities and ${CARS.length} cars.`);
}

main()
  .then(() => console.log("Main function finished successfully!"))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    console.log("Disconnecting from database...");
    await prisma.$disconnect();
    console.log("Done.");
  });