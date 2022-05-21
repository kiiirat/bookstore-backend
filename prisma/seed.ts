import { PrismaClient, Prisma } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();

const bookData: Prisma.BookCreateInput[] = [
  {
    title: "Clean Code: A Handbook of Agile Software Craftsmanship",
    author: "Robert Martin",
    price: 300,
    imageUrl:
      "https://images-na.ssl-images-amazon.com/images/I/41xShlnTZTL._SX218_BO1,204,203,200_QL40_FMwebp_.jpg",
    stock: 50,
  },
  {
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    price: 205,
    imageUrl:
      "https://images-na.ssl-images-amazon.com/images/I/41SNoh5ZhOL._SX440_BO1,204,203,200_.jpg",
    stock: 40,
  },
  {
    title: "Structure and Interpretation of Computer Programs",
    author: "Harold Abelson",
    price: 210,
    imageUrl:
      "https://images-na.ssl-images-amazon.com/images/I/4186AAibrkL._SX343_BO1,204,203,200_.jpg",
    stock: 40,
  },
  {
    title: "The Clean Coder: A Code of Conduct for Professional Programmers",
    author: "Robert Martin",
    price: 220,
    imageUrl:
      "https://images-na.ssl-images-amazon.com/images/I/51uO-K+V5dL._SX381_BO1,204,203,200_.jpg",
    stock: 40,
  },
  {
    title: "Code Complete: A Practical Handbook of Software Construction",
    author: "Steve McConnell",
    price: 300,
    imageUrl:
      "https://images-na.ssl-images-amazon.com/images/I/41nvEPEagML._SX408_BO1,204,203,200_.jpg",
    stock: 300,
  },
  {
    title: "Design Patterns: Elements of Reusable Object-Oriented Software",
    author: "Erich Gamma",
    price: 400,
    imageUrl:
      "https://images-na.ssl-images-amazon.com/images/I/51szD9HC9pL._SX395_BO1,204,203,200_.jpg",
    stock: 400,
  },
  {
    title:
      "The Pragmatic Programmer: Your Journey To Mastery, 20th Anniversary Edition",
    author: "David Thomas",
    price: 350,
    imageUrl:
      "https://images-na.ssl-images-amazon.com/images/I/51W1sBPO7tL._SX380_BO1,204,203,200_.jpg",
    stock: 350,
  },
  {
    title: "Head First Design Patterns: A Brain-Friendly Guide",
    author: "Eric Freeman",
    price: 420,
    imageUrl:
      "https://images-na.ssl-images-amazon.com/images/I/61APhXCksuL._SX430_BO1,204,203,200_.jpg",
    stock: 320,
  },
  {
    title: "The Day I Fell Into A Fairytale",
    author: "Ben Miller",
    price: 500,
    imageUrl:
      "https://res.cloudinary.com/dcvb2uds3/image/upload/v1653138518/bookstore/book1_hxsipp.jpg",
    stock: 1000,
  },
  {
    title: "Book of Classic Fairy Tales",
    author: "Eric and Lucy Kincaids",
    price: 50,
    imageUrl:
      "https://res.cloudinary.com/dcvb2uds3/image/upload/v1653138557/bookstore/book2_d2cykb.jpg",
    stock: 200,
  },
  {
    title: "The Road to GraphQL",
    author: "Robin Wieruch",
    price: 300,
    imageUrl:
      "https://res.cloudinary.com/dcvb2uds3/image/upload/v1653139524/bookstore/apollo-graphql_n8bihi.jpg",
    stock: 300,
  },
  {
    title: "Fairy Tales From around the World",
    author: "Teya Evans",
    price: 25,
    imageUrl:
      "https://res.cloudinary.com/dcvb2uds3/image/upload/v1653141727/bookstore/book4_aytj91.jpg",
    stock: 100,
  },
  {
    title: "Web Development with Node and Express",
    author: "Ethan Brown",
    price: 300,
    imageUrl:
      "https://res.cloudinary.com/dcvb2uds3/image/upload/v1653142289/bookstore/51nhZFck7cL._SX379_BO1_204_203_200__nawqo4.jpg",
    stock: 20,
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
