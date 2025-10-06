# LWS AI - AI Image Generation Studio

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A feature-rich, single-page web application that provides a user-friendly studio for generating images using the Pollinations AI service. This project allows users to create, manage, and save their AI-generated artwork in a clean, modern interface.

---

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Setup](#project-setup)
- [Available Scripts](#available-scripts)
- [File Structure](#file-structure)
- [Special Notes](#special-notes)


---


## Features

This application provides a complete workflow for AI image generation and management.

### 🎨 Core Image Generation
- **Prompt-Based Creation:** Describe any image you want using natural language.
- **Enhanced Prompt Input:**
    - **Template Selection:** Pick from curated prompt templates to kickstart your ideas.
    - **AI Prompt Generator:** Let the app suggest creative prompts for you.
    - **Voice Input:** Speak your prompt directly using speech-to-text capabilities.
- **Image Grid Display:** Generates a grid of 9 images from a single prompt, offering multiple options at once.
- **Status-Based Rendering:** Each image shows its current state:
    - *Queued:* Waiting for generation.
    - *Loading:* Animated spinner with a progress bar.
    - *Error:* Displays an error icon and helpful message.
- **Image Modal:** Click an image to view it larger, with metadata (prompt, model, seed, dimensions).

### 🔄 Context-Aware Prompt Autocompletion

To enhance the creative process and help users craft more effective prompts, this application features an intelligent autocomplete system. Instead of just providing random prompts, this feature interactively suggests relevant options from a predefined library as the user types.

This transforms the prompt input from a simple text field into a powerful discovery tool, speeding up workflow and improving the quality of generated images.

## How to Use

1.  **Start Typing**: Navigate to the "Create Image" page and begin typing in the prompt input field.
2.  **View Suggestions**: After typing 3 or more characters, a dropdown menu will automatically appear below the input, showing up to 5 suggestions from the prompt library that match your input.
3.  **Select a Prompt**: Click on any suggestion from the list. The input field will be instantly populated with the selected prompt.
4.  **Generate**: Continue to edit the prompt or click the generate button.


## How It Works (Technical Breakdown)

* **Data Aggregation**: The system fetches all prompts from `/public/prompts.json` and `/public/generated-prompts.json`. It combines them into a single, unified list in the `CreateImagePage` component.
* **Live Filtering**: This master list is passed to the `PromptInput` component. A `useEffect` hook listens for changes to the user's input. It filters the list in real-time to find case-insensitive matches for the typed text.
* **Dynamic Rendering**: The top 5 matches are stored in a state variable, which conditionally renders a dropdown list. When a user clicks a suggestion, it updates the parent's state, and the dropdown disappears.

## Customization

The power of the suggestion engine comes from its data source. To add, remove, or modify the autocomplete suggestions:

* Simply edit the JSON arrays in `/public/prompts.json` and `/public/generated-prompts.json`.

The application will automatically pick up any changes on the next reload.

### 🎲 Remix Prompt: Generate New Styles from a Good Idea

The "Remix Prompt" feature provides a powerful way to iterate on a successful prompt without getting stuck in a creative loop. When you find an image whose prompt you like, this feature lets you instantly re-run that prompt with a completely new and random seed.

This is perfect for when you think, "I love this concept, but I want to see a completely different take on it."

## How to Use

1.  **Generate a Batch:** Create your initial grid of images.
2.  **Find a Concept You Like:** Identify an image where the core idea and prompt text are strong.
3.  **Click the Game Die Icon (🎲):** Hover over your chosen image and click the "Remix Prompt" button (which now shows a refresh icon in the UI).
4.  **A New Batch Appears:** The application will immediately:
    * Copy the prompt, model, and dimensions into the main settings.
    * **Clear the seed field** to ensure randomization.
    * Generate a brand new grid of images using that prompt, but with a completely different artistic style and composition.


## How It Works (Technical Breakdown)

* **State Update:** The `handleGenerateMore` function in `CreateImagePage.jsx` is triggered on click.
* **Settings Replication:** It dispatches actions to update the `prompt`, `model`, and `dimensions` in the `ImageGenerationContext` to match the selected image.
* **Seed Randomization:** Crucially, it dispatches an action to set the `seed` to an empty string (`payload: ""`).
* **New Generation:** When `generateImages()` is called, the context sees that the seed field is empty and therefore generates a new, random `baseSeed`, ensuring the subsequent batch of images is entirely fresh.


### ✨ Image Modal Thumbnail Navigation

**Feature:**
- Users can now click on thumbnail previews inside the image modal to instantly view that specific image.

**Why it matters:**
- This enhances the user experience by allowing quick access to any image in the current generation set without needing to scroll one by one.

**How it works:**
- A row of mini thumbnails appears beneath the main image in the modal. Clicking any thumbnail immediately displays that image in full preview.

### 🖌️ Enhanced Canvas Editor

The **Canvas Editor** is a powerful, in-browser image editor built directly into the application. It empowers you to annotate, transform, and enhance your generated images without needing any external software. This turns the app into a one-stop creative suite, from generation to final touches.

**Features:**

-   **Freehand Drawing**
    Draw on the image using a customizable brush with color and size controls.

-   **Text Annotations**
    Click anywhere on the canvas to place user-input text with adjustable color and size.

-   **Emoji Stickers**
    Choose from a set of popular emojis to add playful elements to your image.

-   **Image Filters**
    Apply instant visual effects like **Grayscale**, **Sepia**, and **Invert** to change the mood of your artwork.

-   **Image Rotation**
    Rotate the image in 90-degree increments with a single click.

-   **Undo/Redo History**
    Every drawing action is recorded and can be reversed or re-applied using undo/redo buttons.

-   **Clear & Reset**
    Revert the canvas back to the original, unedited image with a single click.

-   **Image Download**
    Save your edited masterpiece as a high-quality `.png` file using the download button.

## 💡 How It Works

-   When a user clicks the **Edit** button on any generated image, the `CanvasEditorModal` opens and loads the image onto a `<canvas>` element at its full resolution.
-   The editor uses React state to manage transformations like `rotation` and `filter` non-destructively. When a filter or rotation is applied, the canvas is cleared and the base image is redrawn with the new transformation, preserving the original image data.
-   User actions like drawing, text, and emoji placement are rendered directly on top of the transformed base image.
-   The final canvas state, including all drawings and transformations, can be downloaded at any time. The editor's history does not yet include filter or rotation changes.

### 🔎 Interactive Image Comparison

This feature allows users to select two generated images and compare them directly with an interactive slider. It provides a powerful and intuitive way to analyze subtle differences between generations.

## 💡 How It Works

-   ✅ **Selection**: Users select images for comparison using a bold checkmark button (`BsCheckCircleFill` from `react-icons`) on each image card.
-   🔢 **Selection Limit**: Only two images can be selected at a time. Selecting more triggers a toast notification 🔔.
-   🔘 **Comparison Button**: Once two images are selected, a floating **Compare Selected (2)** button appears at the bottom-right corner.
-   ↔️ **Interactive Slider Modal**: Clicking the button opens a modal with a dynamic comparison view. Instead of a static side-by-side display, you can **drag a slider** left and right to seamlessly wipe between the two images.
-   📊 **Detailed Metadata**: Below the slider, key metadata for both images (like `prompt`, `model`, and `seed`) is clearly displayed, helping you track the exact parameters that created each result.
-   ❌ **Close Modal**: Clicking outside the modal or on the close (✖️) button closes the comparison view.

**Pro Tip:** This feature is perfect for seeing how a small change in a prompt or a different seed affects the final outcome!


### 📂 Organize Your Workflow with Image Collections

As you generate more artwork, managing your creations becomes essential. The **Collections** feature addresses this by providing a powerful, album-like system directly within the application. It allows you to group related images into named collections, such as "Project Logos," "Sci-Fi Landscapes," or "Character Studies."

This transforms the application from a simple image generator into a structured creative workspace, helping you maintain a tidy environment and easily access images for specific projects.

## How to Use

1.  **Find an Image**: On the "Create Image" page, hover over any generated image to reveal the action icons.
2.  **Add to a Collection**: Click the **Add to Collection** icon (a folder with a plus sign). A modal window will appear.
3.  **Create or Select**:
    * To create a new collection, type a name in the input field at the bottom and click the checkmark.
    * To add to an existing album, simply click on its name from the list.
4.  **View & Manage**: Navigate to the **Collections** page using the main header. Here you can view all your albums, see the images within them, remove specific images, or delete entire collections.

## How It Works (Technical Breakdown)

* **Local Persistence**: All collection data is stored directly in the user's browser in `localStorage` under the key `lws-ai-collections`. The data is structured as a JSON object where each key is a unique collection ID.
* **Centralized State Management**: A dedicated React Context, `CollectionsContext.jsx`, manages the state for all collection-related data. It uses a `useReducer` hook for predictable state transitions (e.g., `CREATE_COLLECTION`, `ADD_IMAGE_TO_COLLECTION`).
* **Lazy Initialization**: The context uses the "lazy initializer" pattern with `useReducer` to synchronously load all data from `localStorage` the moment the app starts. This prevents race conditions and ensures data is always ready for display on page load.
* **Component Integration**: The `ImageCard` component has been updated with a button that opens the `AddToCollectionModal`, a self-contained component for handling the creation and selection logic. The `CollectionsPage` dynamically renders the collections and their contents by pulling state from the `CollectionsContext`.

## Data & Privacy

The power of this feature lies in its simplicity and privacy.

* All of your collections and images are stored **locally on your computer** within your browser's storage. No data is ever sent to an external server.
* This ensures your work remains private and accessible even if you are offline.


### 📊 Your Creative Stats Dashboard

The **"My Stats"** page provides a personalized dashboard that offers insightful analytics into your creative habits. By processing the data stored locally in your browser, it generates charts and key metrics that help you understand your workflow, discover your most-used settings, and see when you're most productive.

---

## 🔢 Key Metrics & Visualizations

- **Usage Overview**: High-level counts of total images generated, unique prompts used, favorites, and downloads.
- **Curation Rate**: A unique percentage showing how many of your generated images you deem good enough to save (as a favorite or in a collection).
- **Top Keywords & Models**: Bar charts displaying your most frequently used prompt keywords and AI models.
- **Creative Habits**: Bar charts breaking down your activity by image dimension, aspect ratio, day of the week, and time of day.
- **Prompt Analysis**: A detailed look at your prompting style, including your longest and shortest prompts and your overall lexical diversity.

---

## ⚙️ How It Works

- The `StatsPage` component accesses data from all the application's contexts (`useDownloads`, `useFavourites`, `useImageGeneration`, etc.).
- A `useMemo` hook is used to perform all statistical calculations efficiently. This ensures that the complex data processing only runs when the underlying data changes, not on every render.
- All calculations—from word frequency analysis to aspect ratio simplification—are done **client-side**.
- The data is passed to a reusable `StatCard` component, which dynamically renders either a key value or a dependency-free CSS bar chart to visualize the information.

---

### 💾 Export & Import Your Data

This feature gives you full ownership and control over your data. You can save a complete backup of your entire workspace and restore it on any device, ensuring your work is never lost.

---

## 📤 Features

- **One-Click Export**: Download a single `.json` file containing all your settings, prompt history, favorites, downloads, and collections.
- **Seamless Import**: Upload a backup file to completely restore your workspace.
- **Danger Zone**: A secure option to permanently clear all application data from your browser.

---

## 🧭 How to Use

1. **Navigate** to the Settings page from the main header.

2. **To Export**:
   - Click the **"Export Data"** button.
   - A backup file named `lws-ai-studio-backup-[date].json` will be saved to your computer.

3. **To Import**:
   - Click the **"Import from File"** button and select your backup `.json` file.
   - You will be asked to **confirm the action**, as it will overwrite all current data.
   - After confirming, the app will **reload** with your restored data.

---

## 🔍 How It Works

- **Export**:
  - Reads all relevant keys from the browser’s `localStorage`.
  - Bundles them into a single JavaScript object and converts it to a JSON string.
  - Creates a `Blob` from the string and triggers download via a temporary link.

- **Import**:
  - Uses the `FileReader` API to read the selected `.json` file as text.
  - Parses the JSON back into an object with `JSON.parse()`.
  - Clears the current `localStorage` (after confirmation), writes the new data, and performs a `window.location.reload()` to reinitialize the app with the imported data.




### ⚙️ Advanced Generation Controls
- **Model Selection:** Choose from dynamically fetched AI models.
- **Seed Control:** Lock a seed for reproducibility or leave blank for randomness.
- **Custom Dimensions:** Set width/height manually or use presets (`1:1`, `16:9`, `4:3`, `3:2`).
- **Watermark Toggle:** Enable/disable the Pollinations logo on images.

### 🖼️ Personalization & History
- **Favourites System:** Mark images as favourites and browse them in a dedicated page.
- **Downloads History:** All downloaded images are tracked and displayed.
- **Prompt History Sidebar:**
    - Auto-saves recent prompts with thumbnails.
    - Click a prompt to reuse.
    - Searchable and clearable.
- **Local Persistence:** All app data (generated images, favourites, downloads, prompt history) is saved in `localStorage`.

---

## Technology Stack

- **React.js:** UI framework
- **Tailwind CSS:** Styling with utility classes
- **React Hooks & Context API:** State management
- **React Icons:** Icon library for UI states
- **React Hot Toast:** User notifications
- **Pollinations AI:** API backend for image generation

---

## Project Setup

To get a local copy up and running, follow these simple steps.

1.  **Clone the repository:**
    ```sh
    git clone repo_url_here
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd path_to_project_directory
    ```
3.  **Install NPM packages:**
    ```sh
    npm install
    ```
4.  **Run the development server:**
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

---

## Available Scripts

In the project directory, you can run:

### `npm run dev`
Runs the app in development mode. Open [http://localhost:5173](http://localhost:5173) to view it in your browser. The page will reload when you make changes.

### `npm run build`
Builds the app for production to the `dist` folder (Vite default). It correctly bundles React in production mode and optimizes the build for the best performance.

---

## File Structure

The project follows a standard React application structure, organized for scalability and maintainability.

```text
/src
├── /api         # Centralized API call logic (pollinationsAPI.js)
├── /assets      # Static assets like logos, images
├── /components  # Reusable React components (ImageCard, PromptInput, etc.)
├── /context     # Global state management via Context API
├── /pages       # Main page components (CreateImagePage, FavouritesPage, etc.)
├── App.jsx      # Main application component
<<<<<<< HEAD
└── main.jsx     # Entry point of the application (Vite default)
=======
└── main.jsx     # Entry point of the application (Vite default)

```

## Special Notes

- The **`gptimg` model** requires a special "upgraded" seed to function properly. Acceptable seed values include keywords like `"flower"` or `"nectar"`. Using a regular numeric seed may result in errors or no image generation.
- The application will prompt the user if an invalid seed is used with the `gptimg` model.
- For more details, refer to the [Pollinations API documentation](https://pollinations.ai/).
