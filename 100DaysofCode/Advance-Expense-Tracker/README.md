# 💰 Expense Tracker

An intuitive and accessible web-based Expense Tracker to help you manage your personal finances, categorize spending, and visualize your budget with ease.
✨ Features

Add/Edit/Delete Expenses: Full CRUD (Create, Read, Update, Delete) functionality for managing your expenditures.
Persistent Storage: Expenses are saved locally in your browser's local storage, ensuring your data is retained across sessions.
API Integration (Placeholder): Designed with a structure to integrate with a backend API for more robust data management and syncing.
Search & Filter: Easily find specific expenses by name, category, or date, and filter by category.
Pagination: Efficiently browse through large lists of expenses with pagination controls.
Data Visualization: A dynamic bar chart (powered by Chart.js) provides a clear overview of your spending distribution by category.
Import/Export: Backup and restore your expense data by importing from or exporting to JSON files.
Multi-language Support:Ready for localization with English, Hindi, Spanish, Chinese, Russian, Japanese, and Arabic translations.
Multi-currency Support: Displays expenses in your preferred currency with conversion capabilities (using mock rates for demonstration).
Responsive Design: Optimized for various screen sizes, from mobile phones to large desktop displays.
Accessibility (A11y) Focused: Built with ARIA attributes and semantic HTML to ensure usability for screen reader users and keyboard navigation.
SEO & OpenGraph Ready: Includes meta tags for better search engine indexing and social media sharing previews.

## 🚀 Technologies Used

HTML5 Semantic structure with ARIA for accessibility.
CSS3: Modern styling, responsive design with media queries, custom properties, and animations.
JavaScript (ES6+): Object-oriented approach for app logic, DOM manipulation.
Axios: Promise-based HTTP client for (future) API requests.
Chart.js: Flexible charting library for data visualization.
Font Awesome: For scalable vector icons.

Managing Expenses:
Add New Expense: Click the "Add New Expense" button. A modal will appear where you can enter the expense name, amount, category, and date. Click "Save Expense".

Navigating Expenses

Search:Use the "Search expenses..." input to filter expenses by name, category, or date.
Filter by Category: Select a category from the "All Categories" dropdown to view only expenses within that category.
Pagination: Use the "Prev" and "Next" buttons to navigate through pages of expenses.

Data Management:
Import: Click the "Import" button, then select a `.json` file containing previously exported expense data.
Export: Click the "Export" button to download your current expense data as a `.json` file.

### Customization

Language: Use the language switcher in the header to change the UI language.
Currency:Use the currency switcher in the header to change the displayed currency. (Note: This is currently using mock conversion rates).
