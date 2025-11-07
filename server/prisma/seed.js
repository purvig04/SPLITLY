import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const categories = [
    {
      name: "Food",
      keywords: [
        "food",
        "meal",
        "lunch",
        "dinner",
        "pizza",
        "burger",
        "snack",
        "restaurant",
        "coffee",
      ],
    },
    {
      name: "Travel",
      keywords: [
        "travel",
        "trip",
        "taxi",
        "cab",
        "bus",
        "train",
        "flight",
        "fuel",
        "petrol",
        "hotel",
      ],
    },
    {
      name: "Utilities",
      keywords: [
        "electricity",
        "bills",
        "internet",
        "wifi",
        "subscription",
        "mobile",
        "recharge",
        "gas",
        "water",
      ],
    },
    {
      name: "Entertainment",
      keywords: [
        "movie",
        "party",
        "music",
        "concert",
        "outing",
        "game",
        "netflix",
        "prime",
        "spotify",
      ],
    },
    {
      name: "Shopping",
      keywords: [
        "shopping",
        "clothes",
        "dress",
        "accessories",
        "gift",
        "online",
        "amazon",
      ],
    },
    {
      name: "Groceries",
      keywords: [
        "grocery",
        "vegetable",
        "fruits",
        "supermarket",
        "milk",
        "bread",
        "daily",
        "food items",
      ],
    },
    {
      name: "Health & Fitness",
      keywords: [
        "gym",
        "doctor",
        "medicine",
        "health",
        "fitness",
        "yoga",
        "supplement",
        "checkup",
      ],
    },
    {
      name: "Education",
      keywords: [
        "book",
        "course",
        "tuition",
        "study",
        "exam",
        "class",
        "education",
        "learning",
        "college",
      ],
    },
    {
      name: "Rent",
      keywords: [
        "rent",
        "room",
        "house",
        "flat",
        "pg",
        "apartment",
        "landlord",
      ],
    },
    {
      name: "Other",
      keywords: ["other", "misc", "general", "random", "unclassified"],
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }
}

main()
  .then(() => console.log("Categories seeded"))
  .catch(console.error())
  .finally(() => prisma.$disconnect());

