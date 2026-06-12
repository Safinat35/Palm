# 🛒 Soft Palm – Modern E-commerce Platform

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green)
![Stripe](https://img.shields.io/badge/Stripe-Payments-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-UI-skyblue)
![License](https://img.shields.io/badge/License-MIT-orange)

A full-stack modern e-commerce web application built with **Next.js, Supabase, and Stripe**, designed for scalability, performance, and real-world production use.

---

## ✨ Features

- 🛍️ Dynamic product catalog (Supabase-powered)
- 👤 Secure authentication (Login / Sign up)
- 🛒 Real-time shopping cart system
- 💳 Stripe Checkout (Test Mode supported)
- 📦 Order management system
- 🧾 Order history tracking
- 🧑‍💼 Admin dashboard (role-based access control)
- 📧 Automated email confirmations
- ⚡ Fast performance with Next.js App Router

---

## 🧱 Tech Stack

| Layer        | Technology |
|-------------|------------|
| Frontend     | Next.js, React, Tailwind CSS |
| Backend      | Supabase (Auth + Database + RLS) |
| Payments     | Stripe Checkout |
| Emails       | Resend |
| Deployment   | Vercel |

---

## 🔐 Security

- Supabase Authentication
- Row Level Security (RLS)
- Role-based access (User / Admin)
- Protected API routes

---

## 💳 Payment Flow

1. Add products to cart 🛒  
2. Proceed to Stripe Checkout 💳  
3. Complete payment (Test Mode supported)  
4. Order automatically created 📦  
5. Cart cleared 🧹  
6. Confirmation email sent 📧  

---

## 📦 Database Schema

- `products` → Product catalog  
- `cart_items` → Shopping cart  
- `orders` → Order records  
- `order_items` → Order details  
- `profiles` → User roles  

---

## 🧑‍💼 Admin Panel

- View all orders 📦  
- Manage users 👤  
- Role-based access control 🔐  
- Secure dashboard system  

---

## ⚙️ Installation

```bash
git clone https://github.com/your-repo/palm.git
cd palm
npm install
npm run dev
🔑 Environment Variables

Create .env.local:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key

STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_public_key

RESEND_API_KEY=your_resend_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
🚀 Project Vision

Soft Palm is a production-ready e-commerce system built to demonstrate real-world architecture using modern web technologies, scalable backend systems, and secure payment processing.

📌 Status

✔ MVP Completed
✔ Stripe Integration Done
✔ Email System Active
✔ Admin Panel Ready
🚀 Ready for Production Deployment

💡 Future Improvements
Webhook-based payment verification
Advanced analytics dashboard
Product reviews system
Inventory management
Mobile app version
📄 License
MIT License © 2026 Soft Palm