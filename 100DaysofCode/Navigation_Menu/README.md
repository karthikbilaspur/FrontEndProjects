# Ultimate Gaming Console Timeline
This project is an interactive web page showcasing the timeline of gaming console generations, combining three distinct navigation styles (Tabbed, Accordion, Scroll-Snap) with dynamic content loading, "Read More/Less" functionality, and a Dark/Light mode toggle. All structural HTML for the navigation layouts and content is dynamically injected via JavaScript, making the core `index.html` file extremely minimal.
## Features
*   **Three Navigation Layouts:**
    *   **Tabbed View:** A horizontal tab-based navigation where clicking a tab replaces the entire content area with details for that generation. Includes a dropdown for "Modern Era" generations.
    *   **Accordion View:** A vertical sidebar navigation with collapsible categories (e.g., "Early Consoles"). Clicking a category expands to show specific generations, and clicking a generation scrolls to its content.
    *   **Scroll-Snap View:** An immersive, full-screen experience where each console generation takes up the entire viewport. Navigation dots on the side allow for quick jumps between sections, and the content snaps into place.
*   **Dynamic Content Injection:** All HTML for the layouts and the console generation data is stored within JavaScript strings and dynamically rendered into the DOM based on user selection.
*   **Layout Selector:** A dropdown menu at the top allows users to easily switch between the three different navigation experiences.
*   **Dark/Light Mode Toggle:** A button to switch between a light and dark color scheme. Your preference is saved locally.
*   **"Read More/Less" Functionality:** Each console generation entry includes a "Read More" button that expands to reveal a more detailed description. Clicking it again changes it to "Read Less" and collapses the text.
*   **Active State Highlighting:** Navigation links (tabs, accordion links, scroll-snap dots) dynamically highlight the currently active section.
*   **Smooth Scrolling:** All internal navigation links utilize smooth scrolling.
*   **Responsive Design:** Adapts layouts for better usability on smaller screens (e.g., mobile hamburger menus, adjusted layouts).
## Project Structure
20 lines (15 loc) · 2.1 KB
. ├── index.html ├── style.css └── script.js

*   `index.html`: The minimalist entry point. Contains only the `<head>`, global controls (layout selector, theme toggle), and a single `div` (`#app-container`) where all dynamic content is loaded.
*   `style.css`: Contains all the CSS rules for every layout, including base styles, theme variables, and responsive adjustments. Selectors are carefully scoped to ensure styles apply correctly to dynamically injected elements.
*   `script.js`: The brain of the operation. Stores all HTML templates as JavaScript strings, manages layout switching, theme toggling, read more/less functionality, and the specific interactive logic for each navigation type.
## How to Set Up and Run
1.  **Clone or Download:** Get the project files.
    *   If using Git: `git clone <repository-url>`
    *   Or simply download the `index.html`, `style.css`, and `script.js` files into a single directory.
2.  **Open `index.html`:** Navigate to the directory where you saved the files and open `index.html` directly in your web browser. There's no need for a local server, as all resources are local.
## How to Use
1.  **Choose a Layout:** Use the "Choose Layout" dropdown at the top to switch between "Tabbed Layout," "Accordion Layout," and "Scroll-Snap Layout."
2.  **Toggle Theme:** Click the "Toggle Dark Mode" (or "Toggle Light Mode") button to change the site's color scheme. Your choice will be remembered for future visits.
3.  **Explore Content:**
    *   **Tabbed Layout:** Click on the generation tabs (or the "Modern Era" dropdown) to instantly view that generation's details.
    *   **Accordion Layout:** Click on the era headers (e.g., "Early Consoles") to expand/collapse the list of generations. Click a specific generation link to scroll to its content.
    *   **Scroll-Snap Layout:** Scroll naturally or click the navigation dots on the right to jump between full-screen generation sections.
4.  **Read More/Less:** Within each console generation's description, click the "Read More" button to expand the detailed text. Click "Read Less" to collapse it.
## Technical Notes
*   **Dynamic Element Selection:** All JavaScript functions must use `document.querySelector` or `document.querySelectorAll` on the `appContainer` or within the currently active layout wrapper to ensure they target the dynamically injected elements correctly.
*   **Event Listener Management:** Event listeners are carefully attached and, where necessary, re-attached or cloned (for read more/less buttons) upon layout switching to ensure functionality without duplicates.
*   **Intersection Observers:** Used for the Accordion (to highlight active sidebar links during scroll) and Scroll-Snap (to animate content and highlight active dots) layouts.
*   **CSS Scoping:** Extensive use of class prefixes (e.g., `.tabbed-layout-wrapper .tab-links`) and wrapper classes ensures that CSS rules for one layout do not interfere with another.
Enjoy your ultimate gaming console