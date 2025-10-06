# 📰 News Portal

This is a dynamic news portal built using **Next.js** that supports multi-language, API integration, routing, error handling, and dynamic imports.
It includes full CRUD support for news data and advanced routing features using **Parallel Routing** and **Intercepting Routes** in Next.js.

---

## 🚀 Features

### ✅ API Endpoints

- `GET /api/news`
  Returns the full list of news items from `data.json`.

- `GET /api/news/:id`
  Returns a single news object based on `id`.
  If the `id` does not exist, returns an error message.

- `PATCH /api/news/:id`
  Allows updating the `title` and `description` of a specific news item.

  - Only `title` and `description` fields are allowed for update.
  - Responds with updated news object.
  - If an invalid field is provided, returns an error.

- `DELETE /api/news/:id`
  Deletes the news item with the given `id`.
  Responds with a success message or an error if the `id` does not exist.

---

## 🧩 UI Functionality

- All news are dynamically imported from `data.json` using **dynamic import** (not `fetch` or `axios`).
- News are displayed as **cards** in a grid layout.
- Clicking on a news card opens a **modal** showing full details.
- URL updates to `/news/:newsId` when modal is open.
- Uses **Parallel Routing** and **Intercepted Routing** to open modal and support deep linking.

---

## ⚠️ Error Handling

- If a user navigates to an unknown route, a **common Not Found page** is shown.
- If a user visits a non-existent news ID like `/news/999`, a **news-specific Not Found message** is shown:
  `"This News with {newsId} id was not found!"`

---

## 🌐 Multi-language Support

- Supports both **English** and **বাংলা** (Bangla).
- Multi-language support implemented using language JSON files.
- Auto-detects browser language preference and switches accordingly.
- Only UI texts like Navbar, Footer, Comments, etc., are translated.
- `data.json` content remains the same across languages.

---

## 🧪 How to Run

```bash
git clone repo_url
cd path-to-folder
npm install
npm run dev

```

## 📁 Project Structure (Simplified)

```js
.news
├── .next
├── app
| ├── [lang]
| | ├── news
| | | ├── @modal
| | | | ├── (..news)
| | | | | └── [id]
| | | | | ├── loading.js
| | | | | └── page.js
| | | | └── default js
| | | ├── [id]
| | | ├── layout.js
| | | └── page.js
| | ├── layout.js
| | ├── loading.js
| | └── page.js
| ├── api
| | └── news
| | ├── [id]
| | | └── route.js
| | └── route.js
| ├── error.js
| ├── favicon.ico
| ├── globals.css
| ├── layout.js
| └── not-found.js
├── components
| ├── article
| | ├── ArticleBody.jsx
| | ├── ArticleHeader.jsx
| | ├── ArticleImage.jsx
| | ├── Sidebar.jsx
| | └── SocialActions.jsx
| ├── header
| | ├── Header.jsx
| | ├── LanguageSwitcher.jsx
| | ├── Logo.jsx
| | ├── NavLists.jsx
| | └── SubscribeButton.jsx
| ├── icons
| ├── FeatureStory.jsx
| ├── MarqueeBanner.jsx
| ├── Modal.jsx
| ├── ModalBgOverlay.jsx
| ├── NewsCard.jsx
| └── NewsSection.jsx
├── data
| ├── data.json
| ├── bn.json
| └── en.json
├── node_modules
├── public
| └── assets
├── utils
| ├── dictionaries.js
| ├── estimateReadTime.js
| └── getTimeAgo.js
├── .gitignore
├── eslint.config.mjs
├── jsconfig.json
├── middleware.js
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
└── README.md


```
