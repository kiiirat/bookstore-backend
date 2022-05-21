import { PrismaClient, Prisma } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();

const bookData: Prisma.BookCreateInput[] = [
  {
    title: "Clean Code: A Handbook of Agile Software Craftsmanship",
    author: "Robert Martin",
    imageUrl:
      "https://images-na.ssl-images-amazon.com/images/I/41xShlnTZTL._SX218_BO1,204,203,200_QL40_FMwebp_.jpg",
    price: 200,
    stock: 20,
  },
  {
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    imageUrl:
      "https://images-na.ssl-images-amazon.com/images/I/41SNoh5ZhOL._SX440_BO1,204,203,200_.jpg",
    price: 205,
    stock: 40,
  },
  {
    title: "Structure and Interpretation of Computer Programs",
    author: "Harold Abelson",
    imageUrl:
      "https://images-na.ssl-images-amazon.com/images/I/4186AAibrkL._SX343_BO1,204,203,200_.jpg",
    price: 210,
    stock: 40,
  },
  {
    title: "The Clean Coder: A Code of Conduct for Professional Programmers",
    author: "Robert Martin",
    imageUrl:
      "https://images-na.ssl-images-amazon.com/images/I/51uO-K+V5dL._SX381_BO1,204,203,200_.jpg",
    price: 220,
    stock: 40,
  },
  {
    title: "Code Complete: A Practical Handbook of Software Construction",
    author: "Steve McConnell",
    imageUrl:
      "https://images-na.ssl-images-amazon.com/images/I/41nvEPEagML._SX408_BO1,204,203,200_.jpg",
    stock: 300,
    price: 300,
  },
  {
    title: "Design Patterns: Elements of Reusable Object-Oriented Software",
    author: "Erich Gamma",
    imageUrl:
      "https://images-na.ssl-images-amazon.com/images/I/51szD9HC9pL._SX395_BO1,204,203,200_.jpg",
    stock: 400,
    price: 400,
  },
  {
    title:
      "The Pragmatic Programmer: Your Journey To Mastery, 20th Anniversary Edition",
    author: "David Thomas",
    imageUrl:
      "https://images-na.ssl-images-amazon.com/images/I/51W1sBPO7tL._SX380_BO1,204,203,200_.jpg",
    stock: 350,
    price: 350,
  },
  {
    title: "Head First Design Patterns: A Brain-Friendly Guide",
    author: "Eric Freeman",
    imageUrl:
      "https://images-na.ssl-images-amazon.com/images/I/61APhXCksuL._SX430_BO1,204,203,200_.jpg",
    stock: 320,
    price: 320,
  },
];

const userData: Prisma.UserCreateInput[] = [
  {
    email: "admin@sample.com",
    password: "samplepassword",
  },
  {
    email: "user@sample.com",
    password: "password",
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const user of userData) {
    const newUser = await prisma.user.create({
      data: {
        ...user,
        password: await argon2.hash(user.password),
      },
    });
    console.log(`Created user with id: ${newUser.id}`);
  }

  for (const book of bookData) {
    const user = await prisma.book.create({
      data: book,
    });
    console.log(`Created book with id: ${user.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
