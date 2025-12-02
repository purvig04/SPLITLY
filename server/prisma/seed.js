import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const categories = [
    {
      name: "Food",
      icon: "fa-solid fa-utensils",
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
      icon: "fa-solid fa-plane",
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
      icon: "fa-solid fa-bolt",
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
      icon: "fa-solid fa-film",
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
      icon: "fa-solid fa-bag-shopping",
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
      icon: "fa-solid fa-bag-shopping",
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
      icon: "fa-solid fa-dumbbell",
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
      icon: "fa-solid fa-graduation-cap",
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
      icon: "fa-solid fa-house",
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
      icon: "fa-solid fa-ellipsis",
      keywords: ["other", "misc", "general", "random", "unclassified"],
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {
        icon: category.icon,
        keywords: category.keywords,
      },
      create: category,
    });
  }
}

main()
  .then(() => console.log("Categories seeded"))
  .catch((err) => {
    console.error(err);
  })
  .finally(() => prisma.$disconnect());

