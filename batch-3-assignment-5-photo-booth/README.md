# Photo Booth Feed App

A modern web application for sharing posts, commenting, and engaging with a social feed. Built with React and Vite, this app features a responsive UI, post saving, notifications, theming (dark/light mode), and social login via Firebase.

---

## Table of Contents

-   [Photo Booth Feed App](#photo-booth-feed-app)
    -   [Table of Contents](#table-of-contents)
    -   [Installation](#installation)
    -   [Initial Requirements](#initial-requirements)
    -   [Extra Features Documentation](#extra-features-documentation)
        -   [1. Theming (Dark/Light Mode)](#1-theming-darklight-mode)
        -   [2. Post Saving](#2-post-saving)
        -   [3. Social Login with Firebase](#3-social-login-with-firebase)
    -   [Folder Structure](#folder-structure)
    -   [Mind Map / Thought Process](#mind-map--thought-process)
        -   [🧠 Thought Process](#-thought-process)
        -   [🗺️ Mind Map](#️-mind-map)
    -   [Usage](#usage)
    -   [Customization](#customization)
    -   [Technology used](#technology-used)
    -   [Contact](#contact)

---

## Installation

1. **Clone the repository:**

    ```sh
    git clone repo_url
    ```

2. **Install dependencies:**

    ```sh
    npm install
    # or
    yarn install
    ```

3. **Configure Firebase:**

    - Edit `src/lib/firebase.config.js` with your Firebase project credentials.

4. **Start the development server:**

    ```sh
    npm run dev
    # or
    yarn dev
    ```

5. **Open in your browser:**
    - Visit [http://localhost:5173](http://localhost:5173)

---

## Initial Requirements

-   Convert `login.html` and `register.html` to React components.
-   Add routes: `/login` and `/register` for login and registration.
-   Use JWT for user authentication and authorization.
-   On homepage `/`, show full content to authenticated users.
-   For unauthenticated users, show only 3-4 posts with infinite scroll; show login/register popup after scrolling through them.
-   Redirect user to Edit Profile page after successful registration.
-   On Edit Profile, allow updating profile picture, website, bio, gender, and password.
-   Implement password strength indicator with 4 colors (red, orange, yellow, green).
-   Implement infinite scroll on homepage using paginated post API (10 posts per page).
-   Each post should show image, caption, like count, comment count, and time.
-   Truncate long captions and add "Show More / Show Less" toggle.
-   Allow authenticated users to like, comment, and share posts.
-   Copy post link to clipboard on clicking Share; link should go to Post Details page.
-   Truncate comments preview and show "View all X Comments" linking to Post Details.
-   Authenticated users can add comments from Home and Post Details pages.
-   If unauthenticated, clicking like/comment shows login/register popup.
-   Allow editing and deleting comments from Post Details page.
-   Show list of users who liked a post in a custom-designed way.
-   Show "More from this user" section in Post Details for other posts by same user.
-   Clicking any username navigates to that user's Profile page.
-   On own Profile page, show "Edit Profile" button.
-   Use given `profile.html` and API to render Profile page.
-   Side Navigation should appear on all pages except Login and Register.
-   Side Navigation must include: Home, Notification, Create, and Profile buttons.
-   Navigation buttons should route to respective pages and highlight active page.
-   Load notifications from API; only show like and comment notifications.
-   Clicking notification navigates to related Post Details page.
-   Create Post page accessible from "Create" in Side Navigation.
-   Validate post form to ensure image and caption are required.
-   Show loading indicators and error messages where appropriate.
-   Use provided `Success-Dialog` and `Error-Dialog` components where needed.
-   Implement custom dialogs and validation UIs matching template design theme.

---

## Extra Features Documentation

### 1. Theming (Dark/Light Mode)

**Description:**
Switch between dark and light themes for a comfortable viewing experience.

**Features:**

-   Toggle button in the sidebar or header.
-   Theme preference saved in local storage.
-   Applies to all components.

**How to Use:**

-   Click the theme toggle to switch modes.
-   The app remembers your preference.

**Customization:**

-   Edit theme styles in `src/index.css`.

---

### 2. Post Saving

**Description:**
Save your favorite posts for quick access later.

**Features:**

-   "Save" button on each post card.
-   Saved posts are accessible from a dedicated section.
-   Saved state persists in local storage or user profile.

**How to Use:**

-   Click the "Save" icon on a post.
-   View saved posts from the sidebar or profile.

**Customization:**

-   Adjust logic in `src/components/Posts/PostCard.jsx` and saved posts context.

---

### 3. Social Login with Firebase

**Description:**
Sign in with Google or other providers using Firebase Authentication.

**Features:**

-   Google login button on the login page.
-   User profile and avatar displayed after login.
-   Secure authentication flow.

**How to Use:**

-   Click "Sign in with Google" on the login screen.
-   Grant permissions and start using the app.

**Customization:**

-   Update providers in `src/lib/firebase.config.js`.

> **Note: You can't update password from edit profile if you authenticate with google**

---

## Folder Structure

```
src/
├── components/
│   ├── auth/
│   ├── comments/
│   ├── dialog/
│   ├── posts/
│   ├── profile/
│   ├── shared/
│   └── ui/
│       └── ThemeSwitcher.jsx
├── contexts/
│   └── ThemeContext.jsx
├── hooks/
│   ├── useAvatar.js
│   ├── useCurrentUser.js
│   ├── useFileUpload.js
│   └── usePosts.js
├── layouts/
│   ├── AuthLayout.jsx
│   └── RootLayout.jsx
├── lib/
│   ├── api.js
│   └── utils.js
├── pages/
│   ├── private/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   └── UserProfile.jsx
├── queries/
│   ├── notifications.js
│   ├── posts.js
│   └── profile.js
├── routes/
│   └── Routes.js
├── stores/
│   ├── useAuth.js
│   ├── useGlobalStore.js
│   ├── useModal.js
│   └── useSavedPosts.js
├── utils/
│   └── index.js
├── validations/
│   └── index.js
├── App.js
└── index.js

```

---

## Mind Map / Thought Process

### 🧠 Thought Process

-   **User Engagement:**
    Focused on making social interaction easy and enjoyable.
-   **Personalization:**
    Added theming and post saving for a tailored experience.
-   **Security:**
    Used Firebase for secure authentication.
-   **Feedback:**
    Implemented notifications for clear user feedback.

### 🗺️ Mind Map

```
Social Feed App
src
├── components
│   ├── auth            → Login/Register related UI components
│   ├── comments        → Comment display/input components
│   ├── dialog          → Dialogs like Login/Register popup, success/error
│   ├── posts           → Post display cards, likes, share, truncate etc.
│   ├── profile         → Profile views, edit forms
│   ├── shared          → Reusable shared components
│   └── ui              → Theming and global UI components
│       └── ThemeSwitcher.jsx
├── contexts
│   └── ThemeContext    → Theme-related context/provider
├── hooks
│   ├── useAvatar       → Avatar uploading & handling
│   ├── useCurrentUser  → Authenticated user fetcher
│   ├── useFileUpload   → Generic file uploader
│   └── usePosts        → Custom hook for fetching posts
├── layouts
│   ├── AuthLayout      → Layout for auth routes
│   └── RootLayout      → Main layout with navigation etc.
├── lib
│   ├── api             → API config / Axios instance
│   └── utils           → Utility functions
├── pages
│   ├── private         → Authenticated-only pages
│   ├── Home.jsx        → Homepage feed and infinite scroll
│   ├── Login.jsx       → Login form
│   ├── Register.jsx    → Register form
│   └── UserProfile.jsx → User profile page
├── queries
│   ├── notifications   → Fetch notification data
│   ├── posts           → Fetch/post post-related data
│   └── profile         → User profile data handling
├── routes
│   └── Routes.js       → All route definitions and guards
├── stores
│   ├── useAuth         → Auth state with JWT
│   ├── useGlobalStore  → Global UI or app state
│   ├── useModal        → Modal open/close handler
│   └── useSavedPosts   → Saved posts or bookmarks
├── utils
│   └── index.js        → Common helper functions
├── validations
│   └── index.js        → Zod or Yup schemas
├── App.jsx              → Root component
└── main.jsx            → Entry point

```

---

## Usage

1. **Sign in** with Credentials.
2. **Browse posts** in the feed.
3. **Create, comment, and save** posts.
4. **Switch themes** using the toggle.
5. **View notifications** for your actions.
6. **Customize profile** update your profile

---

## Customization

-   **Change theme colors:** Edit `src/index.css`.
-   **Add more social providers:** Update `src/firebase.js`.

---

## Technology used

-   [React](https://react.dev/)
-   [Firebase](https://firebase.google.com/)
-   [Tailwind CSS](https://tailwindcss.com/)
-   [Axios](https://www.axios.com/)
-   [Tanstack Query](https://tanstack.com/query/latest)
-   [Zustand](https://zustand-demo.pmnd.rs/)
