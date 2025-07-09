# 🎙️ Text-It: Голос-в-Текст SaaS

Text-It — це full-stack SaaS-додаток для транскрибації аудіо у текст. Користувачі можуть завантажувати аудіофайли, отримувати розшифровку через OpenAI Whisper та при необхідності купувати Pro-доступ для збільшення лімітів.

## 🚀 Технології

### Frontend
- **Next.js** (React + App Router)
- **Clerk** для аутентифікації
- **Tailwind CSS** / shadcn/ui для UI
- **Axios** для роботи з API

### Backend
- **Express.js** REST API
- **Prisma** ORM + PostgreSQL (Supabase)
- **Stripe** для оплати
- **OpenAI API** для транскрибації (Whisper model)
- **Multer** для завантаження аудіофайлів

### Deployment
- **Frontend** — Vercel
- **Backend** — Render
- **База даних** — Supabase

---

## 🔐 Авторизація

- Використовується [Clerk.dev](https://clerk.dev) для реєстрації та входу.
- Авторизація обов'язкова для завантаження файлів.

---

## ⚙️ Backend API

### 📥 POST `/api/upload/audio`
- Завантажує аудіофайл
- Розшифровує через OpenAI Whisper
- Зберігає результат у PostgreSQL

### 📊 GET `/api/users/me`
- Повертає інформацію про поточного користувача (`isPro`, `uploads`)

### 💳 POST `/api/payment/create-checkout-session`
- Створює Stripe Checkout сесію для покупки Pro-доступу

### 📦 POST `/api/webhook/stripe`
- Webhook Stripe. Після оплати оновлює користувача (`isPro = true`)

---

## 💾 База даних (Prisma)

```prisma
model User {
  id        Int      @id @default(autoincrement())
  clerkId   String   @unique
  email     String
  isPro     Boolean  @default(false)
  uploads   Upload[]
  payments  Payment[]
  createdAt DateTime @default(now())
}

model Upload {
  id        Int      @id @default(autoincrement())
  userId    Int
  result    String
  paid      Boolean  @default(false)
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
}

model Payment {
  id               Int      @id @default(autoincrement())
  userId           Int
  stripeSessionId  String
  amount           Int
  createdAt        DateTime @default(now())
  user             User     @relation(fields: [userId], references: [id])
}



## ⚙️ ENV (Backend)

Створи `.env`:
```env
PORT=5000
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 📦 Установка

```bash
# 1. Установка залежностей
npm install

# 2. Запуск сервера
npm run dev
```

---

## 💰 Stripe Checkout

- Checkout-сессія створюється на бекє (`/api/payment/create-checkout-session`)
- Після вдалої оплати визивається Webhook
- В Webhook Юзер отримує Pro-доступ :)

---

## 🧑‍💻 Автор

Made with by [yiwywo18ypwtp1](https://github.com/yiwywo18ypwtp1)
