# Text Utility Studio

![Text Utility Studio Screenshot - Light Mode](https://via.placeholder.com/800x450/E0E0E0/333333?text=Screenshot+of+Light+Mode+UI+Here)
![Text Utility Studio Screenshot - Dark Mode](https://via.placeholder.com/800x450/3A3F4A/E0E0E0?text=Screenshot+of+Dark+Mode+UI+Here)

Welcome to the Text Utility Studio! This is a versatile, client-side web application designed to help you quickly and efficiently perform a wide range of text manipulations, conversions, and generations. Whether you need to reformat text, encode data, or generate placeholder content, this studio has got you covered, all within your browser.

 ✨ Features

The Text Utility Studio is packed with functionalities to make your text editing tasks a breeze:

 General Tools
   Word/Character Count: Instantly see the number of words and characters as you type.
   Copy Output: Copy the transformed text from the output area to your clipboard with a single click.
   Clear All: Clear both the input and output text areas.
   Paste Input: Effortlessly paste text from your clipboard into the input area.
   Swap Text: Exchange the content between the input and output fields.
   Undo/Redo: Navigate through your changes with robust undo and redo functionality, allowing you to experiment freely.
   Theme Toggle: Switch between a sleek light mode and a comfortable dark mode. Your preference is saved!
   Smooth Navigation: Easily jump between tool categories using the navigation bar.
   Toast Notifications: Get subtle, non-intrusive feedback on your actions.

 Text Manipulation
   Uppercase: Convert all text to uppercase.
   Lowercase: Convert all text to lowercase.
   Title Case: Capitalize the first letter of each word.
   Sentence Case: Capitalize the first letter of each sentence.
   Remove Extra Spaces: Collapse multiple spaces into a single space and trim leading/trailing spaces.
   Trim Whitespace: Remove only leading and trailing whitespace from the entire text.
   Reverse Text: Reverse the order of characters in the entire text.
   Find & Replace: A powerful tool to find specific text and replace it with new content. Supports case-sensitive and regular expression searches.
   Compare Text (Diff): _(Coming Soon!)_ Will allow comparing two texts to highlight differences.

 Line Operations
   Sort Lines (A-Z/Z-A): Sort lines alphabetically in ascending or descending order.
   Remove Duplicate Lines: Eliminate identical lines, keeping only unique entries.
   Remove Empty Lines: Remove lines that are completely empty or contain only whitespace.
   Remove Duplicate Words per Line: Process each line and remove any duplicate words within that specific line.
   Shuffle Lines: Randomly reorder all lines in the input text.
   Add Line Numbers: Prepend each line with its corresponding number.
   Remove Line Numbers: Remove common line number formats from the beginning of lines.
   Add Prefix/Suffix to Lines: Add custom text to the beginning and/or end of every line.
   Join Lines: Combine multiple lines into a single line using a specified separator. Option to remove empty lines before joining.
   Split Lines: Divide text into new lines based on a custom separator. Supports regular expressions.

 Tab & Space Tools
   Tabs to Spaces: Convert tab characters into a specified number of spaces.
   Spaces to Tabs: Convert sequences of spaces into tab characters (based on a specified count of spaces per tab).

 Content Generation
   Generate Lorem Ipsum: Quickly create placeholder text with a specified number of paragraphs.

 Format Conversion
   Markdown to HTML: _(Coming Soon!)_ Will convert Markdown formatted text into HTML.
   HTML to Markdown: _(Coming Soon!)_ Will convert HTML into Markdown formatted text.

 Data Encoding/Decoding
   URL Encode/Decode: Encode and decode text for use in URLs.
   Base64 Encode/Decode: Encode and decode text using Base64. Handles Unicode characters.
   HTML Entity Encode/Decode: Convert special characters to and from HTML entities.

 Word/Character Tools
   Generate Slug: Convert a given text into a URL-friendly slug (e.g., "My Awesome Article" -> "my-awesome-article").

 🚀 How to Use

1.Open in Browser: Simply open the `index.html` file in your web browser. No server-side setup required!
2.  Input Text: Type or paste your text into the "Input Text" area.
3.  Choose a Tool: Select any of the buttons under the various categories (Text Manipulation, Line Operations, etc.) to apply an action.
4.  View Output: The result of the operation will appear in the "Output Text" area.
5.  Interact with Modals: For tools requiring additional input (like "Find & Replace" or "Add Prefix/Suffix"), a modal window will appear. Enter your details and click "Confirm".
6.  Copy/Clear: Use the "Copy Output" button to grab your transformed text or "Clear All" to start fresh.
7.  Undo/Redo: Use the "Undo" and "Redo" buttons to revert or reapply changes.
8.  Toggle Theme: Click the moon/sun icon in the header to switch between light and dark modes.

 🛠️ Technologies Used

   HTML5: For the structure and content of the web page.
   CSS3: For styling, including responsive design and custom properties (CSS Variables) for easy theme switching.
   JavaScript (ES6+): For all interactive functionalities, text processing, and DOM manipulation.

 💡 Future Enhancements

   Full Markdown/HTML Conversion: Integrate robust libraries for comprehensive Markdown to HTML and HTML to Markdown conversion.
   Text Comparison (Diff): Implement a feature to visually compare two blocks of text.
   More Advanced RegEx Tools: A dedicated section for advanced regular expression testing and building.
   Batch Operations: Allow applying multiple transformations in a sequence.
   User Preferences: More customization options saved to `localStorage`.
   PWA Support: Make it a Progressive Web App for offline access and quicker loading.
