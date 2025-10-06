<div align="center">
<h1>🌱 FarmFresh Marketplace</h1>
<p><strong>Full‑stack Next.js 14 (App Router) marketplace connecting customers with local farmers.</strong><br/>All core assignment requirements implemented + a rich set of extra, production‑style enhancements.</p>
</div>

## ✨ High‑Level Feature Map

| Domain           | Core Implemented                                                                                                                   | Extras / Enhancements                                                                                                          |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Auth & Session   | Email+Password, Google OAuth, Access+Refresh token handling, Protected routes                                                      | Auto account linking (credentials ⇄ Google), Farmer profile completeness redirect, Session role enrichment, JWT silent refresh |
| Routing UX       | Parallel & Intercepting routes for Login / Register / Product Details modals                                                       | Reusable accessible modal component with background scroll lock & ESC close                                                    |
| Products         | CRUD (farmer), publish/unpublish, category filtering, search, stock management, featured products (top purchase / fallback recent) | Image gallery (≤5), organic flag, purchase counter, server validations, dynamic SEO metadata per product                       |
| Cart & Favorites | Add/Remove, toggle from listings & details, dedicated pages                                                                        | Optimistic UI contexts, persistent server models, navbar counters                                                              |
| Orders / Booking | Create order (Buy Now + cart merge), status workflow (pending→confirmed→shipped→delivered / cancel), farmer & buyer views          | Editable order modal (qty, address), stock reservation & restoration on cancel, multi-order invoice bundling                   |
| Reviews          | One review per user per product, conditional “Write a Review” if purchased, edit/delete own review, pagination (Load more 5)       | Logged‑in user review surfaced first, average & total rating summary badges                                                    |
| Search & Filters | Keyword + category search, category deep‑link from homepage preselects filter                                                      | Search persistence on products page with inline refine UI (better UX)                                                          |
| Payment Flow     | Simulated payment, order summary, fees, success page, email confirmation                                                           | PDF invoice email + on‑demand download (single or multi), enriched invoice layout & branding                                   |
| Email            | Password reset link, order confirmation with table & totals                                                                        | PDF invoice attachment (SendGrid), environment‑driven company branding, graceful fallback if email creds missing               |
| SEO              | Home + product dynamic OpenGraph/Twitter cards                                                                                     | Centralized SEO utility (base URL resolution, description trimming, canonical), social share friendly images                   |
| UI State         | Loading, Error, Not Found boundaries per route                                                                                     | Skeletons, chunk error reload helper, accessible focus management in modals                                                    |
| Security         | Secure reset tokens (ttl), credential hashing, role based gating (farmer vs user)                                                  | Neutral responses for reset, selective field projection, server‑side role enrichment                                           |
| Code Quality     | Modular actions & models, NextAuth adapter, Mongo indexes                                                                          | Reusable UI tokens, centralized env based company metadata for invoices                                                        |

## ✅ Assignment Requirements Coverage

1. Authentication with Access & Refresh Tokens → Implemented via NextAuth JWT strategy + Google refresh flow (custom refreshAccessToken).
2. Login & Registration using provided templates → Replicated UX with parallel/intercepting modal routes + dedicated full pages on reload.
3. Social (Google) login + standard signup → GoogleProvider configured with offline access + account auto-link.
4. Parallel & Intercepting Routing for auth/product details → Implemented under `app/@modal/(...)login|register|products`.
5. Forget & Reset Password (email) → `/forget-password` & `/reset-password` flow; secure token fields on user schema.
6. Home Search → Keyword + category; navigates to products listing with applied query.
7. Products page UX improvement (refine search) → Sticky refine bar showing current keyword & allowing instant re-search.
8. Shop by Category jump with preselected filter → Category click deep-links & auto-selects left filter.
9. Featured Products logic (top purchase else newest 8) → Server logic using purchase count fallback createdAt.
10. Listing item actions (Add to Cart, Favorite toggle, Detail view modal) → All implemented; detail also supports full page.
11. View All from Featured → Navigates to full product catalog.
12. Product Details content parity → Gallery, category, features (organic/fresh flags), farmer name, ratings, description, quantity control, related products & tabs (Description / Reviews / Farmer Info).
13. Add to Cart / Favorite / Buy Now → Immediate cart add toggle & direct payment route for Buy Now.
14. Stock Management → Product stock decremented on order, restored on eligible cancellations; validation to prevent oversell.
15. Reviews rules → Purchase‑gated; one per user; user’s review prioritized; edit/delete; paginated load (5).
16. Related Products → Category based suggestions excluding current product.
17. Payment Process page → Consolidated cart + direct items, address & fee breakdown, simulated payment submission.
18. Success page → Order details summary + payment summary + invoice email trigger.
19. Email PDF Invoice after booking → Implemented with pdf-lib & SendGrid (fallback returns base64).
20. Edit Order Details modal → Custom modal enabling quantity/address adjustments (with stock & price recalcs).
21. Invoice download on success → `/api/orders/invoice` GET streams PDF; also multi-order support.
22. View All Orders page (`bookings.html` equivalent) → Buyer order history + controls (Download / Review / Reorder / Cancel).
23. Farmer order management view → Same page adapts to farmer role showing all their product orders with status transitions.
24. Reorder journey → Recreates cart from prior booking & navigates to payment (with current stock validation).
25. Role‑aware Navbar → Dynamic menus for anonymous, customer, farmer (Add Product / Manage Products vs My Orders / Farmers).
26. Add Product page (farmer only) + create template usage → Protected route; server validation & publish flag.
27. Manage Products page → Search, filter, edit, publish/unpublish, delete, add new.
28. Public Farmers page → Lists registered farmers with key profile info.
29. Cart Page (custom design) → Built from scratch: quantity edits, remove, subtotal, proceed to payment.
30. Favorites Page → Toggle, quick add-to-cart & purchase.
31. Robust states (loading/error/not-found) → Route segment specific boundary components.
32. SEO friendly home & product pages → Dynamic metadata, OG/Twitter tags, canonical URLs.
33. Social share correctness → Product meta image/title/description resolved per item.
34. Bonus creativity & extra features → See “Extra Enhancements” below.

## 🧪 Extra Enhancements (Only Extras)

Purely additional features beyond the required spec:

1. Auto-linking Google OAuth to existing credential accounts (seamless switch).
2. Farmer profile completeness redirect flow.
3. Centralized SEO utility (base URL + smart description trimming).
4. Advanced multi-page PDF invoice (wrapped text, pagination footer, branded summary box).
5. Multi-order bundled invoice email & download (single endpoint for many IDs).
6. Fallback: return base64 PDF when email creds absent (dev friendly).
7. Fully accessible modal system (focus trap intent, ESC, backdrop lock & scroll freeze).
8. Own review always surfaced first (review prioritization logic).
9. Optimistic UI for cart & favorites (instant feedback, server reconcile).
10. Stock reservation & restoration model minimizing oversell.
11. Background session enrichment (role/image/name freshness without reload).
12. Granular farmer order status lifecycle + indexed queries.
13. Product image gallery (≤5) with schema validation + OG fallback integration.
14. Purchase counter metric powering featured ranking (atomic updates).
15. Shared UI tokens + skeleton loaders for consistent theming.
16. Structured domain error classes informing SEO (noindex on missing/unpublished).
17. Selective field projection & ObjectId validation hardening.
18. Environment-driven company branding (white‑label invoices & emails).
19. Neutral password reset responses (prevent user/email enumeration).
20. Adaptive single Orders page (buyer vs farmer experience) avoids duplication.
21. Modular action layer separating server logic from components.
22. Chunk error reload helper for resilient hydration.

## 🗂️ Tech Stack Overview

- Next.js 14 App Router (Server Components + Route Handlers)
- NextAuth (Credentials + Google OAuth, MongoDB Adapter)
- MongoDB / Mongoose (schemas with indexes & validation)
- Tailwind CSS (utility-first styling)
- pdf-lib (programmatic invoices)
- SendGrid (transactional emails + attachments) or Resend (password reset) — env based
- bcryptjs (password hashing)

## 🚀 Getting Started

1. Clone & install dependencies:
   ```bash
   npm install
   ```
2. Create `.env.local` with required variables (see below).
3. Run dev server:
   ```bash
   npm run dev
   ```
4. Visit http://localhost:3000

### Required Environment Variables

```
MONGODB_CONNECTION_STRING=your_mongo_uri
NEXTAUTH_SECRET=long_random_string
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...            # (Optional provider configured: GitHub)
GITHUB_CLIENT_SECRET=...
RESEND_API_KEY=re_...           # For password reset emails
SENDGRID_API_KEY=SG....         # For invoice emails with PDF attachment
EMAIL_FROM="FarmFresh <no-reply@yourdomain.com>"

# Company Branding (optional overrides with sensible fallbacks)
COMPANY_NAME=FarmFresh
COMPANY_TAGLINE="Fresh Produce Marketplace"
COMPANY_ADDRESS="123 Green Valley Road, Dhaka, Bangladesh"
COMPANY_PHONE="+8801XXXXXXXXX"
COMPANY_EMAIL=support@farmfresh.local
COMPANY_WEBSITE=https://farmfresh.local
COMPANY_REG_NO=REG-00012345
```

### Password Reset Flow

1. User submits email on Forget Password.
2. Secure token stored (hashed) with expiry; email sent (Resend).
3. User follows link → Reset form (token validated + single use) → Password updated (bcrypt hashed).

### Invoice Generation & Email

1. Payment success triggers POST `/api/orders/invoice` (sends email + returns base64 PDF if configured).
2. User can later download directly (GET with bookingId(s)).
3. Multi-order bundling supported via `bookingIds=id1,id2`.

## 🔐 Roles & Access Control

| Role           | Capabilities                                                                                              |
| -------------- | --------------------------------------------------------------------------------------------------------- |
| Anonymous      | Browse products & farmers, search, view details, start auth modals                                        |
| Customer       | All anonymous + cart, favorites, purchase, review (if bought), reorder, invoice download                  |
| Farmer         | Customer capabilities + add/manage products, view/manage orders for owned products, update order statuses |
| Admin (future) | Reserved for potential moderation & analytics                                                             |

## 🧱 Data Models (Summary)

- User: role, farmer farmDetails, reset token fields.
- Product: name, category, price/kg, stock, purchase counter, publish flag, organic, gallery.
- Booking (Order): buyer, farmer, product, quantityKg, unitPrice, totalPrice, status history.
- Review: unique (product,user), rating 1–5, comment.
- Cart / Favorite: 1 document per user referencing product ids.

## 🛠 Development Notes

- Stock adjustments are atomic; cancellation restores stock before shipped stage.
- JWT refresh logic handles Google access token renewal seamlessly in background.
- All ObjectId inputs validated server-side to prevent cast errors.
- Dynamic SEO returns 404-style metadata with `noindex` for unpublished/missing products.

## 🧪 Testing Ideas (Manual)

- Create farmer, add product, publish, buy from customer, verify stock decrements.
- Cancel pending order as buyer → stock restored.
- Mark order shipped/delivered as farmer; verify customer review unlock after delivered.
- Attempt second review (should be blocked).
- Download invoice for single & multiple orders.
- Share product link on social (inspect OG tags via debuggers).

## 🚧 Potential Future Improvements

- Rate limiting on password reset & invoice endpoints.
- Image optimization / upload service integration.
- Admin analytics dashboard (sales per category / farmer performance).
- Multi-currency support.
- Real payment gateway (Stripe) integration.

## 🔒 Security Considerations

- Bcrypt hashing for credentials; OAuth users can later set password via reset flow.
- Reset tokens stored hashed & time-bound (prevents reuse/leak value).
- Minimal field projection when enriching sessions (prevents oversharing PII).
- Role checks server-side before product/order mutations.

## 🙌 Credits

Built with Next.js, Tailwind, NextAuth, MongoDB, pdf-lib, SendGrid/Resend. Assignment specification implemented fully plus added production-grade polish.

---

For any clarifications or to review specific implementation sections, see `actions/`, `models/`, and `app/api/` route handlers.
