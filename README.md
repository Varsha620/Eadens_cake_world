# 🎂 Eadens Cake World

Welcome to **Eadens Cake World** — a modern full-stack web application built for showcasing and managing a bakery business online!

## 🚀 Tech Stack

- **Frontend:** Next.js 13+ (App Router), React, TypeScript
- **Styling:** TailwindCSS
- **Backend:** Node.js, Prisma ORM
- **Database:** (assumed from Prisma) —SQLite
- **Package Management:** pnpm
- **Deployment:** (not yet)

## 📂 Project Structure

- `app/` — Core application routes and pages
- `components/` — Reusable React components
- `hooks/` — Custom React hooks
- `lib/` — Utilities and helper functions
- `prisma/` — Database schema and Prisma client
- `public/` — Static assets (images, etc.)
- `styles/` — Global styles (Tailwind / PostCSS configs)

## ⚙️ Getting Started

1. **Clone the repository:**

```bash
git clone https://github.com/Varsha620/Eadens_cake_world.git
cd eadens-cake-world
```

2. **Install dependencies:**

```bash
pnpm install
# or
npm install
```

3. **Set up environment variables:**

Create a `.env` file at the root and configure your database URL and any other necessary variables.

Example:

```env
DATABASE_URL="your-database-url-here"
NEXT_PUBLIC_API_URL="your-api-url-here"
```

4. **Run the development server:**

```bash
pnpm dev
# or
npm run dev
```

The app should now be running at [http://localhost:3000](http://localhost:3000).

## 🛠 Features

- Beautiful cake listing and showcase
- Dynamic and responsive UI with TailwindCSS
- With  Admin dashboard for order management
- Modular and scalable component architecture
- Prisma ORM integration for database operations
- Fully type-safe with TypeScript
- Middleware for handling authentication or redirects (via `middleware.ts`)

## 📸 Screenshots
# *Glimpses from home page*
![ss1](https://github.com/user-attachments/assets/83461b1b-4a2d-4102-9be5-d96290f58a2a) ![ss16](https://github.com/user-attachments/assets/9583b86c-c751-4354-a416-e6894b5c88d0) ![ss17](https://github.com/user-attachments/assets/ade81947-bec6-49c2-afe1-76dd497e8787)


# *Login page (authentication done)*
![ss2](https://github.com/user-attachments/assets/2aa16019-1e82-40d5-b6a8-307c6ffd65ee)

# *User options:*
*Order customized cake*
![ss6](https://github.com/user-attachments/assets/2c2c50b9-b520-49a4-88e9-ab45ce132e72) 

*Shopping menu and cart*
![ss14](https://github.com/user-attachments/assets/cbfae526-9772-4a54-bb7c-641ba2e4561b)
![ss13](https://github.com/user-attachments/assets/3fd8e675-56f5-426c-9e40-5e87f5bf4475)

*Customers can give their review*
![ss4](https://github.com/user-attachments/assets/5d0b8662-3603-4b15-88b1-d506cbde7ded)

*View details about their account and order details; history with order status also visible*
![ss3](https://github.com/user-attachments/assets/1a5f1674-9757-48a7-8af5-89832de4921c)
![ss5](https://github.com/user-attachments/assets/1dcb2bc2-5576-478a-a62f-61a56e90db98)


# *Admin Dashboard:*
*Admin option to accept/reject an order ; to see accepted orders ; to see completed orders*</br>
*Each event delivery dates can be seen through calender*
![ss12](https://github.com/user-attachments/assets/89ba4ebb-9a0a-441b-b9d7-b7a5fe44ba20) ![ss9](https://github.com/user-attachments/assets/3841d06c-6950-4d41-ab5d-11a028bff6cd) ![ss10](https://github.com/user-attachments/assets/a0222b1f-873f-4b94-8537-94a60d35f309)

*Add, Edit, Delete a product in the menu*
![ss15](https://github.com/user-attachments/assets/eb2a75e1-628c-492a-98f4-f02a44dc6880)



## ✨ Future Improvements

- Payment gateway integration
- Responsive enhancements
- Unit and integration tests

## 🤝 Contribution

Pull requests and contributions are welcome!  
If you find any issues, feel free to open an issue or submit a PR.


Developed with ❤️ by Varsz.
