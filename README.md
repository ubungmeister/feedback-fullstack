# **Feedback Collection App**

## **📌 Overview**
Small full-stack application is designed for collecting and displaying user feedback. It was developed as part of a task for a company.

## **🛠️ Tech Stack**
- **Next.js** – Frontend & API routes
- **Prisma** – ORM for database management
- **Supabase** – PostgreSQL database & authentication

## **📄 Pages**
- **`/signin` & `/signup`** – User authentication (login/registration).
- **`/feedback`** – Allows logged-in users to submit feedback.
- **`/feedbacklist`** – Displays all feedbacks; users can edit or delete their own.

## **🔐 Access Control**
- Only **authenticated users** can post feedback.
- **Unauthorized users** cannot submit feedback.
- Users can **edit or delete only their own feedback**.

## **🚀 Deployment**
The app is deployed on **Vercel**.

## **📜 Installation & Setup**
### 1️⃣ **Clone the repository:**
```sh
git clone https://github.com/your-repo.git
cd your-repo
```

### 2️⃣ **Install dependencies:**
```sh
npm install
```

### 3️⃣ **Set up environment variables:**
Create a **`.env`** file and add:
```env
DATABASE_URL="your_supabase_database_url"
NEXTAUTH_URL="your_vercel_deployment_url"
```

### 4️⃣ **Run database migrations:**
```sh
npx prisma migrate deploy
```

### 5️⃣ **Run the development server:**
```sh
npm run dev
```
