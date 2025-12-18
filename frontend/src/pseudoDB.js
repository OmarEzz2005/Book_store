// pseudoDB.js

export const usersDB = [
  {
    id: 1,
    username: "admin",
    password: "Admin123", // in real apps, NEVER store plain passwords
    role: "admin",
    fname: "Admin",
    lname: "User",
    email: "admin@example.com",
    phone: "1234567",
    address: "",
  },
  {
    id: 2,
    username: "omar",
    password: "Omar1234",
    role: "customer",
    fname: "Omar",
    lname: "Tamer",
    email: "omar@example.com",
    phone: "0123456789",
    address: "Alexandria",
  },
];

export const booksDB = [
  {
    id: 1,
    isbn: "978-0001",
    title: "React Basics",
    price: 20,
    category: "Programming",
    pub_year: 2023,
    publisher_id: "P001",
    threshold: 2,
    qty: 5,
  },
  {
    id: 2,
    isbn: "978-0002",
    title: "Database Systems",
    price: 25,
    category: "CS",
    pub_year: 2022,
    publisher_id: "P002",
    threshold: 3,
    qty: 10,
  },
];

export const ordersDB = [
  {
    id: 1,
    customerId: 2,
    customer: "Omar Tamer",
    total: 45,
    status: "Pending", // Pending, Confirmed, Cancelled
    items: [
      { title: "React Basics", price: 20 },
      { title: "Database Systems", price: 25 },
    ],
  },
];
