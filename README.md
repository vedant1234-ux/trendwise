# 📰 **TrendWise**

### *AI-Powered SEO Blog Platform Built with Next.js & OpenRouter*

TrendWise is a modern full-stack blogging platform that **automatically generates SEO-optimized articles** on trending topics using state-of-the-art AI models like **GPT-4, Claude, and Gemini** via [OpenRouter](https://openrouter.ai). Built for performance, responsiveness, and discoverability, it combines intelligent automation with sleek design.

---

## 🚀 Features

* 🔥 Automatically generate articles on trending topics
* ⏱️ New AI article published **every hour**
* 🧠 Powered by OpenRouter AI (GPT-4, Claude, Gemini)
* 🗃️ Stores content in **MongoDB**
* 🖼️ Dynamic Unsplash image support with fallback
* 🔍 Search and tag filtering
* ✍️ Google-authenticated comment system
* ✅ SEO-optimized (meta tags, OG tags, sitemap, robots.txt)
* 📱 Fully responsive UI with **Tailwind CSS**
* 🛠️ Optional Admin Panel for article management

---

## 🧱 Tech Stack

| Layer      | Technology                                  |
| ---------- | ------------------------------------------- |
| Frontend   | **Next.js 14** (App Router, TypeScript)     |
| Styling    | **Tailwind CSS**                            |
| Auth       | **NextAuth.js** (Google OAuth)              |
| AI Content | **OpenRouter** (GPT-4, Claude, Gemini)      |
| Database   | **MongoDB + Mongoose**                      |
| Hosting    | **Vercel** (Frontend), **Render** (Backend) |
| Images     | **Unsplash API**                            |

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/trendwise.git
cd trendwise
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Environment Variables

Create a `.env.local` file in the root:

```env
MONGODB_URI=your_mongodb_connection_string
OPENROUTER_API_KEY=your_openrouter_api_key
NEXTAUTH_SECRET=your_nextauth_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_URL=http://localhost:3000
UNSPLASH_ACCESS_KEY=your_unsplash_access_key
```

> 💡 Make sure your Google app is configured at [Google Cloud Console](https://console.cloud.google.com/apis/credentials)

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🧠 AI Article Generation

Use the script below to generate articles on trending topics:

```bash
node generate-real-articles-openrouter.cjs
```

> ✅ Each article includes a title, meta description, content, tags, publication date, and a topic-based image.

You can automate this using a cron job or scheduled task to run every hour.

---

## 📸 Unsplash Image Integration

* Automatically fetches images based on article topic
* Uses fallback image if no relevant image is found
* Supports image updates for older articles without images

To enable this, ensure the following in `.env.local`:

```env
UNSPLASH_ACCESS_KEY=your_unsplash_access_key
```

---

## 🧾 Article Schema (MongoDB)

```js
{
  title: String,
  slug: String,
  content: String,
  metaDescription: String,
  ogImage: String, // Unsplash image URL
  tags: [String],
  author: String,
  publishedAt: Date,
  createdAt: { type: Date, default: Date.now }
}
```

---

## 🔐 Authentication

* Sign in with Google using **NextAuth.js**
* Only logged-in users can **post comments**
* Admin routes protected via **NextAuth session**

---

## 📈 SEO & Crawling

* Meta tags + Open Graph tags for all articles
* Dynamic `sitemap.xml` at `/sitemap.xml`
* `robots.txt` to guide web crawlers

---

## 🛠 Admin Panel (Optional)

Secure route at `/admin` to:

* View articles
* Trigger article generation

> 🔒 Protected via session authentication

---

## 📂 Folder Structure

```
trendwise/
├── src/
│   ├── app/                # Next.js App Router layout and routes
│   ├── components/         # Reusable UI components
│   ├── lib/                # MongoDB & utility logic
│   ├── models/             # Mongoose models (Article, User, etc.)
│   └── api/                # API routes (articles, comments, auth)
├── public/                 # Static assets (images, icons)
├── generate-real-articles-openrouter.cjs  # AI article generator
├── .env.local              # Environment config
└── README.md
```

---

## 🧑‍💻 Credits

Built with ❤️ by [**Vedan Warghade**](https://github.com/vedanwarghade)
AI by [OpenRouter](https://openrouter.ai) | Images by [Unsplash](https://unsplash.com)

---

## 📄 License

This project is licensed under the **MIT License**.
Feel free to fork, contribute, or use it for your own blog!

---

## ⭐️ Show Your Support

If you like this project, consider giving it a ⭐️ on GitHub!

--- 