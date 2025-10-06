# 📚 Blogify - Lws Assignment

A Next.js 14 blog application built as part of an assignment. This project converts given HTML templates to Next.js with Tailwind CSS, loads blog data from a local JSON file, supports category filtering, date sorting, and dynamic blog detail pages — all implemented with server-side rendering (SSR).

## 🚀 Features

✅ **Next.js 14 & Tailwind CSS** — Modern frontend stack.

✅ **Server-side Rendering (SSR)** — Both home and blog details pages are rendered on the server.

✅ **Dynamic Routing** — Blog detail pages are accessible at `/blog/{BLOG-TITLE}`.

✅ **DangerouslySetInnerHTML** — Blog descriptions are rendered with HTML support.

✅ **Category Filter** — Multiple categories can be selected or toggled to show relevant blogs.

✅ **Sorting** — Blogs can be sorted by date, considering filtered categories.

✅ **404 Handling** — If a blog is not found, a user-friendly "Not Found" message is displayed.

✅ **Direct URL Access** — Users can directly navigate to a blog URL, and it will render correctly.

## 📄 Requirements Fulfilled

✅ Created project using `npx create-next-app@14` with Tailwind CSS.

✅ Converted given HTML templates to Next.js pages/components without modifications.

✅ Loaded and parsed blog data from `data/data.json`.

✅ Displayed blog cards on the home page with title, date, and category.

✅ Implemented category filter section "Discover more of what matters to you" with toggle functionality.

✅ Allowed multiple categories to be selected; if none selected, all blogs are shown.

✅ Sorted blogs by date using the "Sort by" option, respecting active categories.

✅ Used server-side rendering for both home and blog details pages.

✅ Created dynamic routes for blog details at `/blog/{BLOG-TITLE}`.

✅ Rendered blog descriptions with `dangerouslySetInnerHTML`.

✅ Displayed "Not Found" message if blog not found via URL segment.

✅ On blog details page, selecting a category navigates to home with filtered blogs.

## 🔥 Running the Project

Clone the repo and install dependencies:

```bash
git clone repo-url
cd path-to-folder
npm install
```
