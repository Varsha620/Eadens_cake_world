import { PrismaClient } from "@prisma/client"
import * as bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10)
  const admin = await prisma.user.upsert({
    where: { email: "admin@eadenscakeworld.com" },
    update: {},
    create: {
      email: "admin@eadenscakeworld.com",
      name: "Admin User",
      password: adminPassword,
      role: "ADMIN",
    },
  })

  // Create test customer
  const customerPassword = await bcrypt.hash("customer123", 10)
  const customer = await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      email: "customer@example.com",
      name: "Test Customer",
      password: customerPassword,
      role: "CUSTOMER",
      address: "123 Test St, Test City, TC 12345",
      phone: "(123) 456-7890",
    },
  })

  // Create products
  const products = [
    {
      name: "Chocolate Delight",
      description: "Rich chocolate cake with ganache frosting",
      longDescription:
        "Indulge in our Chocolate Delight cake, a decadent treat for chocolate lovers. This cake features layers of moist chocolate sponge, filled with smooth chocolate ganache, and covered in a rich chocolate frosting. Perfect for birthdays, anniversaries, or any special occasion that calls for something truly delicious.",
      price: 35.99,
      category: "chocolate",
      image: "/placeholder.svg?height=600&width=600",
      sizes: JSON.stringify(["6 inch", "8 inch", "10 inch"]),
      ingredients: JSON.stringify(["Flour", "Sugar", "Cocoa powder", "Eggs", "Butter", "Milk", "Vanilla extract"]),
      allergens: JSON.stringify(["Eggs", "Dairy", "Gluten"]),
    },
    {
      name: "Vanilla Dream",
      description: "Light vanilla cake with buttercream frosting",
      longDescription:
        "Our Vanilla Dream cake is a classic favorite. Made with premium vanilla extract and topped with our signature buttercream frosting, this cake offers a delicate flavor that everyone loves. The light and fluffy texture makes it perfect for any celebration.",
      price: 32.99,
      category: "vanilla",
      image: "/placeholder.svg?height=600&width=600",
      sizes: JSON.stringify(["6 inch", "8 inch", "10 inch"]),
      ingredients: JSON.stringify(["Flour", "Sugar", "Eggs", "Butter", "Milk", "Vanilla extract"]),
      allergens: JSON.stringify(["Eggs", "Dairy", "Gluten"]),
    },
    {
      name: "Strawberry Bliss",
      description: "Fresh strawberry cake with cream cheese frosting",
      longDescription:
        "Our Strawberry Bliss cake is made with real strawberries folded into the batter and topped with cream cheese frosting. It's a perfect balance of sweetness and tanginess that will delight your taste buds.",
      price: 38.99,
      category: "fruit",
      image: "/placeholder.svg?height=600&width=600",
      sizes: JSON.stringify(["6 inch", "8 inch", "10 inch"]),
      ingredients: JSON.stringify(["Flour", "Sugar", "Eggs", "Butter", "Milk", "Fresh Strawberries", "Cream Cheese"]),
      allergens: JSON.stringify(["Eggs", "Dairy", "Gluten"]),
    },
    {
      name: "Red Velvet",
      description: "Classic red velvet cake with cream cheese frosting",
      longDescription:
        "Our Red Velvet cake is a timeless classic with a modern twist. The deep red cake layers are complemented by a smooth cream cheese frosting, creating a perfect balance of flavors.",
      price: 36.99,
      category: "specialty",
      image: "/placeholder.svg?height=600&width=600",
      sizes: JSON.stringify(["6 inch", "8 inch", "10 inch"]),
      ingredients: JSON.stringify([
        "Flour",
        "Sugar",
        "Cocoa powder",
        "Eggs",
        "Butter",
        "Buttermilk",
        "Vinegar",
        "Red food coloring",
        "Cream Cheese",
      ]),
      allergens: JSON.stringify(["Eggs", "Dairy", "Gluten"]),
    },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.name.toLowerCase().replace(/\s+/g, "-") },
      update: product,
      create: {
        id: product.name.toLowerCase().replace(/\s+/g, "-"),
        ...product,
      },
    })
  }

  // Create sample reviews
  const reviews = [
    {
      userId: customer.id,
      rating: 5,
      comment: "The birthday cake for my daughter was absolutely perfect! Everyone loved it.",
    },
    {
      userId: customer.id,
      rating: 4,
      comment: "Great cake, but delivery was a bit late. Would order again though!",
    },
  ]

  for (const review of reviews) {
    await prisma.review.create({
      data: review,
    })
  }

  console.log("Database has been seeded!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

