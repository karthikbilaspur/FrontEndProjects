document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('inputText');
    const wordCountSpan = document.getElementById('wordCount');
    const charCountSpan = document.getElementById('charCount');
    const outputText = document.getElementById('outputText');
    const copyOutputBtn = document.getElementById('copyOutputBtn');
    const clearInputOutputBtn = document.getElementById('clearInputOutputBtn');
    const pasteInputBtn = document.getElementById('pasteInputBtn');
    const swapTextBtn = document.getElementById('swapTextBtn');
    const undoBtn = document.getElementById('undoBtn');
    const redoBtn = document.getElementById('redoBtn');

    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const toastContainer = document.getElementById('toast-container');

    // Modal elements
    const modal = document.getElementById('toolModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalConfirmBtn = document.getElementById('modalConfirm');
    const modalCancelBtn = document.getElementById('modalCancel');
    const closeModalBtn = document.querySelector('.close-button');

    // Undo/Redo State Management
    let history = [{ input: '', output: '' }];
    let historyPointer = 0;
    const MAX_HISTORY = 50; // Limit history size

    // --- Utility Functions ---

    // Function to show toast notifications
    const showToast = (message, duration = 3000) => {
        const toast = document.createElement('div');
        toast.classList.add('toast');
        toast.textContent = message;
        toastContainer.appendChild(toast);

        // Force reflow to enable transition
        void toast.offsetWidth;

        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
            toast.addEventListener('transitionend', () => toast.remove());
        }, duration);
    };

    // Function to update word and character counts
    let inputDebounceTimeout;
    const updateCounts = () => {
        clearTimeout(inputDebounceTimeout);
        inputDebounceTimeout = setTimeout(() => {
            const text = inputText.value;
            charCountSpan.textContent = text.length;

            const words = text.split(/\s+/).filter(word => word.length > 0);
            wordCountSpan.textContent = words.length;

            updateUndoRedoButtons(); // Update button states after input change
        }, 150); // Debounce for 150ms
    };

    // --- History Management ---
    const saveState = () => {
        const currentState = { input: inputText.value, output: outputText.value };
        if (historyPointer < history.length - 1) {
            history = history.slice(0, historyPointer + 1); // Discard future history
        }
        history.push(currentState);
        if (history.length > MAX_HISTORY) {
            history.shift(); // Remove oldest state
        }
        historyPointer = history.length - 1;
        updateUndoRedoButtons();
    };

    const undo = () => {
        if (historyPointer > 0) {
            historyPointer--;
            const prevState = history[historyPointer];
            inputText.value = prevState.input;
            outputText.value = prevState.output;
            updateCounts(); // Updates word/char counts and undo/redo buttons
            showToast('Undo successful.');
        } else {
            showToast('Nothing to undo.');
        }
    };

    const redo = () => {
        if (historyPointer < history.length - 1) {
            historyPointer++;
            const nextState = history[historyPointer];
            inputText.value = nextState.input;
            outputText.value = nextState.output;
            updateCounts(); // Updates word/char counts and undo/redo buttons
            showToast('Redo successful.');
        } else {
            showToast('Nothing to redo.');
        }
    };

    const updateUndoRedoButtons = () => {
        undoBtn.disabled = historyPointer <= 0;
        redoBtn.disabled = historyPointer >= history.length - 1;
    };

    // --- Modal Handler ---
    let currentModalResolve;
    const showModal = (title, contentHTML, onConfirm) => {
        return new Promise((resolve) => {
            modalTitle.textContent = title;
            modalBody.innerHTML = contentHTML;
            modal.style.display = 'block';
            document.body.classList.add('modal-open'); // Prevent body scroll

            currentModalResolve = resolve;

            modalConfirmBtn.onclick = () => {
                modal.style.display = 'none';
                document.body.classList.remove('modal-open');
                if (onConfirm) {
                    onConfirm();
                }
                resolve(true); // Confirmed
            };

            modalCancelBtn.onclick = () => {
                modal.style.display = 'none';
                document.body.classList.remove('modal-open');
                resolve(false); // Cancelled
            };

            closeModalBtn.onclick = () => { // Close button (X)
                modal.style.display = 'none';
                document.body.classList.remove('modal-open');
                resolve(false); // Cancelled
            };
        });
    };

    // Close modal if clicked outside
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
            if (currentModalResolve) {
                currentModalResolve(false); // Treat as cancelled
            }
        }
    };

    // --- Core Functions ---

    // Copy Output button functionality
    const copyOutput = async () => {
        if (outputText.value) {
            try {
                await navigator.clipboard.writeText(outputText.value);
                showToast('Output copied to clipboard!');
            } catch (err) {
                showToast('Failed to copy. Please copy manually.', 5000);
                console.error('Failed to copy text: ', err);
            }
        } else {
            showToast('Nothing to copy!');
        }
    };

    // Clear all textareas
    const clearAll = () => {
        inputText.value = '';
        outputText.value = '';
        updateCounts(); // Reset counts
        saveState(); // Save cleared state
        showToast('Input and output cleared!');
    };

    // Paste into Input Textarea
    const pasteIntoInput = async () => {
        try {
            const text = await navigator.clipboard.readText();
            inputText.value = text;
            updateCounts();
            saveState(); // Save state after paste
            showToast('Text pasted!');
        } catch (err) {
            showToast('Failed to read clipboard. Please paste manually.', 5000);
            console.error('Failed to read clipboard contents: ', err);
        }
    };

    // Swap Input and Output Textareas
    const swapText = () => {
        const inputVal = inputText.value;
        inputText.value = outputText.value;
        outputText.value = inputVal;
        updateCounts();
        saveState(); // Save state after swap
        showToast('Input and Output swapped!');
    };

    // --- Tool Implementations ---

    // Text Manipulation
    const upperCaseBtn = document.getElementById('upperCaseBtn');
    const lowerCaseBtn = document.getElementById('lowerCaseBtn');
    const titleCaseBtn = document.getElementById('titleCaseBtn');
    const sentenceCaseBtn = document.getElementById('sentenceCaseBtn');
    const removeExtraSpacesBtn = document.getElementById('removeExtraSpacesBtn');
    const trimWhitespaceBtn = document.getElementById('trimWhitespaceBtn'); // New
    const reverseTextBtn = document.getElementById('reverseTextBtn');
    const findReplaceBtn = document.getElementById('findReplaceBtn');
    const textDiffBtn = document.getElementById('textDiffBtn'); // Still coming soon

    const toUpperCase = () => { outputText.value = inputText.value.toUpperCase(); saveState(); showToast('Text converted to Uppercase.'); };
    const toLowerCase = () => { outputText.value = inputText.value.toLowerCase(); saveState(); showToast('Text converted to Lowercase.'); };
    const toTitleCase = () => {
        outputText.value = inputText.value.replace(/\b\w/g, (char) => char.toUpperCase());
        saveState();
        showToast('Text converted to Title Case.');
    };
    const toSentenceCase = () => {
        const text = inputText.value;
        if (!text) {
            outputText.value = '';
            showToast('Input is empty.', 2000);
            return;
        }
        // Split into sentences using common punctuation. Then capitalize first letter of each.
        // Also handle proper nouns or initialisms.
        outputText.value = text.toLowerCase().replace(/(^\s*|\.\s*|\!\s*|\?\s*)([a-z])/g, (match, sep, char) => sep + char.toUpperCase());
        saveState();
        showToast('Text converted to Sentence Case.');
    };
    const removeExtraSpaces = () => {
        outputText.value = inputText.value.replace(/\s+/g, ' ').trim();
        saveState();
        showToast('Extra spaces removed.');
    };
    // New: Trim Leading/Trailing Whitespace for entire text
    const trimWhitespace = () => {
        outputText.value = inputText.value.trim();
        saveState();
        showToast('Leading/trailing whitespace trimmed.');
    };
    const reverseText = () => {
        outputText.value = inputText.value.split('').reverse().join('');
        saveState();
        showToast('Text reversed.');
    };
    const findAndReplace = async () => {
        const contentHTML = `
            <label for="findInput">Find:</label>
            <input type="text" id="findInput" class="modal-input" placeholder="Text to find">
            <label for="replaceInput">Replace with:</label>
            <input type="text" id="replaceInput" class="modal-input" placeholder="Replacement text">
            <div class="checkbox-group">
                <input type="checkbox" id="caseSensitive">
                <label for="caseSensitive">Case sensitive</label>
            </div>
            <div class="checkbox-group">
                <input type="checkbox" id="regexSearch">
                <label for="regexSearch">Use Regular Expression</label>
            </div>
        `;
        const confirmed = await showModal('Find and Replace', contentHTML, () => {
            const findText = document.getElementById('findInput').value;
            const replaceText = document.getElementById('replaceInput').value;
            const caseSensitive = document.getElementById('caseSensitive').checked;
            const regexSearch = document.getElementById('regexSearch').checked;

            if (!findText) {
                showToast('Find text cannot be empty.', 3000);
                return;
            }

            let result = inputText.value;
            try {
                let flags = 'g'; // Replace all occurrences globally
                if (!caseSensitive) {
                    flags += 'i'; // Case-insensitive
                }

                if (regexSearch) {
                    const regex = new RegExp(findText, flags);
                    result = result.replace(regex, replaceText);
                } else {
                    // For plain text replacement, escape special regex characters in findText
                    const escapedFindText = findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const regex = new RegExp(escapedFindText, flags);
                    result = result.replace(regex, replaceText);
                }
                outputText.value = result;
                saveState();
                showToast('Find and Replace completed.');
            } catch (e) {
                showToast(`Error in Find and Replace: ${e.message}`, 5000);
            }
        });
        if (!confirmed) showToast('Find and Replace cancelled.');
    };

    const compareText = () => {
        showToast('Text Comparison tool coming soon! This needs a dedicated input for the second text or a more complex UI.', 5000);
    };

    // Line Operations
    const textSorterAscBtn = document.getElementById('textSorterAscBtn');
    const textSorterDescBtn = document = document.getElementById('textSorterDescBtn');
    const removeDuplicateLinesBtn = document.getElementById('removeDuplicateLinesBtn');
    const removeEmptyLinesBtn = document.getElementById('removeEmptyLinesBtn');
    const removeDuplicateWordsBtn = document.getElementById('removeDuplicateWordsBtn'); // New
    const shuffleLinesBtn = document.getElementById('shuffleLinesBtn'); // New
    const addLineNumbersBtn = document.getElementById('addLineNumbersBtn');
    const removeLineNumbersBtn = document.getElementById('removeLineNumbersBtn');
    const addPrefixSuffixBtn = document.getElementById('addPrefixSuffixBtn');
    const joinLinesBtn = document.getElementById('joinLinesBtn');
    const splitLinesBtn = document.getElementById('splitLinesBtn');

    const sortLines = (isAscending) => {
        const lines = inputText.value.split('\n');
        // Filter out empty lines by default, but let's make it an option for future?
        const sortedLines = lines.sort((a, b) => {
            if (isAscending) return a.localeCompare(b);
            return b.localeCompare(a);
        });
        outputText.value = sortedLines.join('\n');
        saveState();
        showToast(`Lines sorted ${isAscending? 'ascending' : 'descending'}.`);
    };

    const removeDuplicateLines = () => {
        const lines = inputText.value.split('\n');
        const uniqueLines = [...new Set(lines)];
        outputText.value = uniqueLines.join('\n');
        saveState();
        showToast('Duplicate lines removed.');
    };
    const removeEmptyLines = () => {
        // Filter out lines that are completely empty or only contain whitespace
        const lines = inputText.value.split('\n').filter(line => line.trim()!== '');
        outputText.value = lines.join('\n');
        saveState();
        showToast('Empty lines removed.');
    };
    const removeDuplicateWords = () => { // New
        const lines = inputText.value.split('\n');
        const processedLines = lines.map(line => {
            const words = line.split(/\s+/).filter(word => word.length > 0);
            const uniqueWords = [...new Set(words)];
            return uniqueWords.join(' ');
        });
        outputText.value = processedLines.join('\n');
        saveState();
        showToast('Duplicate words removed per line.');
    };
    const shuffleLines = () => { // New
        const lines = inputText.value.split('\n');
        for (let i = lines.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [lines[i], lines[j]] = [lines[j], lines[i]]; // Fisher-Yates shuffle
        }
        outputText.value = lines.join('\n');
        saveState();
        showToast('Lines shuffled randomly.');
    };

    const addLineNumbers = () => {
        const lines = inputText.value.split('\n');
        outputText.value = lines.map((line, index) => `${index + 1}. ${line}`).join('\n');
        saveState();
        showToast('Line numbers added.');
    };
    const removeLineNumbers = () => {
        const lines = inputText.value.split('\n');
        // Regex to match common line number patterns (e.g., "1.", "1)", "1-", "1. ", " 1. ")
        outputText.value = lines.map(line => line.replace(/^\s*\d+([.)-])?\s*/, '')).join('\n');
        saveState();
        showToast('Line numbers removed.');
    };
    const addPrefixSuffix = async () => {
        const contentHTML = `
            <label for="prefixInput">Prefix:</label>
            <input type="text" id="prefixInput" class="modal-input" placeholder="Text to add at beginning of each line">
            <label for="suffixInput">Suffix:</label>
            <input type="text" id="suffixInput" class="modal-input" placeholder="Text to add at end of each line">
        `;
        const confirmed = await showModal('Add Prefix/Suffix', contentHTML, () => {
            const prefix = document.getElementById('prefixInput').value;
            const suffix = document.getElementById('suffixInput').value;
            const lines = inputText.value.split('\n');
            outputText.value = lines.map(line => prefix + line + suffix).join('\n');
            saveState();
            showToast('Prefix/Suffix added to lines.');
        });
        if (!confirmed) showToast('Operation cancelled.');
    };

    const joinLines = async () => {
        const contentHTML = `
            <label for="separatorInput">Separator:</label>
            <input type="text" id="separatorInput" class="modal-input" value=", " placeholder="e.g., ', ', space, or empty for no separator">
            <div class="checkbox-group">
                <input type="checkbox" id="removeEmptyJoin">
                <label for="removeEmptyJoin">Remove empty lines before joining</label>
            </div>
        `;
        const confirmed = await showModal('Join Lines', contentHTML, () => {
            const separator = document.getElementById('separatorInput').value;
            const removeEmpty = document.getElementById('removeEmptyJoin').checked;
            let lines = inputText.value.split('\n');
            if (removeEmpty) {
                lines = lines.filter(line => line.trim()!== '');
            }
            outputText.value = lines.join(separator);
            saveState();
            showToast('Lines joined.');
        });
        if (!confirmed) showToast('Operation cancelled.');
    };

    const splitLines = async () => {
        const contentHTML = `
            <label for="splitSeparatorInput">Separator:</label>
            <input type="text" id="splitSeparatorInput" class="modal-input" value="," placeholder="e.g., ',', ';', or '\\n' for newline">
            <div class="checkbox-group">
                <input type="checkbox" id="regexSplit">
                <label for="regexSplit">Use Regular Expression</label>
            </div>
        `;
        const confirmed = await showModal('Split Lines', contentHTML, () => {
            const separator = document.getElementById('splitSeparatorInput').value;
            const regexSplit = document.getElementById('regexSplit').checked;

            if (!separator) {
                showToast('Separator cannot be empty.', 3000);
                return;
            }

            let actualSeparator = separator === '\\n'? '\n' : separator;
            let splitResult = [];
            try {
                if (regexSplit) {
                    const regex = new RegExp(actualSeparator, 'g');
                    splitResult = inputText.value.split(regex);
                } else {
                    splitResult = inputText.value.split(actualSeparator);
                }
                outputText.value = splitResult.join('\n');
                saveState();
                showToast('Text split by separator.');
            } catch (e) {
                showToast(`Error splitting text: ${e.message}`, 5000);
            }
        });
        if (!confirmed) showToast('Operation cancelled.');
    };

    // New: Tab/Space Conversion
    const convertTabsToSpacesBtn = document.getElementById('convertTabsToSpacesBtn');
    const convertSpacesToTabsBtn = document.getElementById('convertSpacesToTabsBtn');

    const convertTabsToSpaces = async () => {
        const contentHTML = `
            <label for="spaceCountInput">Number of spaces per tab:</label>
            <input type="number" id="spaceCountInput" class="modal-input" value="4" min="1">
        `;
        const confirmed = await showModal('Convert Tabs to Spaces', contentHTML, () => {
            const numSpaces = parseInt(document.getElementById('spaceCountInput').value, 10);
            if (isNaN(numSpaces) || numSpaces <= 0) {
                showToast('Please enter a valid number of spaces.', 3000);
                return;
            }
            const spaces = ' '.repeat(numSpaces);
            outputText.value = inputText.value.replace(/\t/g, spaces);
            saveState();
            showToast('Tabs converted to spaces.');
        });
        if (!confirmed) showToast('Operation cancelled.');
    };

    const convertSpacesToTabs = async () => {
        const contentHTML = `
            <label for="tabSpaceCountInput">Number of spaces to convert to one tab:</label>
            <input type="number" id="tabSpaceCountInput" class="modal-input" value="4" min="1">
        `;
        const confirmed = await showModal('Convert Spaces to Tabs', contentHTML, () => {
            const numSpaces = parseInt(document.getElementById('tabSpaceCountInput').value, 10);
            if (isNaN(numSpaces) || numSpaces <= 0) {
                showToast('Please enter a valid number of spaces.', 3000);
                return;
            }
            const regex = new RegExp(` {${numSpaces}}`, 'g'); // Match exactly numSpaces
            outputText.value = inputText.value.replace(regex, '\t');
            saveState();
            showToast('Spaces converted to tabs.');
        });
        if (!confirmed) showToast('Operation cancelled.');
    };

    // Content Generation
    const loremIpsumBtn = document.getElementById('loremIpsumBtn');
    const generateLoremIpsum = async () => {
        const contentHTML = `
            <label for="numParagraphsInput">Number of paragraphs:</label>
            <input type="number" id="numParagraphsInput" class="modal-input" value="3" min="1">
        `;
        const confirmed = await showModal('Generate Lorem Ipsum', contentHTML, () => {
            const sampleText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;
            const numParagraphs = parseInt(document.getElementById('numParagraphsInput').value, 10);
            if (!isNaN(numParagraphs) && numParagraphs > 0) {
                let loremText = '';
                for (let i = 0; i < numParagraphs; i++) {
                    loremText += sampleText + (i < numParagraphs - 1? '\n\n' : '');
                }
                outputText.value = loremText;
                saveState();
                showToast('Lorem Ipsum generated.');
            } else {
                showToast('Please enter a valid number for paragraphs.', 5000);
            }
        });
        if (!confirmed) showToast('Operation cancelled.');
    };

    // Format Conversion
    const markdownToHtmlBtn = document.getElementById('markdownToHtmlBtn');
    const htmlToMarkdownBtn = document.getElementById('htmlToMarkdownBtn');
    const markdownToHtml = () => {
        showToast('Markdown to HTML conversion coming soon! This typically requires a Markdown parsing library.', 5000);
    };
    const htmlToMarkdown = () => {
        showToast('HTML to Markdown conversion coming soon! This typically requires an HTML parsing library.', 5000);
    };

    // Data Encoding/Decoding
    const urlEncodeBtn = document.getElementById('urlEncodeBtn');
    const urlDecodeBtn = document.getElementById('urlDecodeBtn');
    const base64EncodeBtn = document.getElementById('base64EncodeBtn');
    const base64DecodeBtn = document.getElementById('base64DecodeBtn');
    const htmlEntityEncodeBtn = document.getElementById('htmlEntityEncodeBtn');
    const htmlEntityDecodeBtn = document.getElementById('htmlEntityDecodeBtn');

    const urlEncode = () => { outputText.value = encodeURIComponent(inputText.value); saveState(); showToast('URL Encoded.'); };
    const urlDecode = () => {
        try {
            outputText.value = decodeURIComponent(inputText.value);
            saveState();
            showToast('URL Decoded.');
        } catch (e) {
            showToast('Error: Invalid URL encoding.', 5000);
            outputText.value = '';
        }
    };
    const base64Encode = () => {
        try {
            outputText.value = btoa(unescape(encodeURIComponent(inputText.value))); // Handles Unicode
            saveState();
            showToast('Base64 Encoded.');
        } catch (e) {
            showToast('Error encoding to Base64. Ensure valid input characters.', 5000);
            outputText.value = '';
        }
    };
    const base64Decode = () => {
        try {
            outputText.value = decodeURIComponent(escape(atob(inputText.value))); // Handles Unicode
            saveState();
            showToast('Base64 Decoded.');
        } catch (e) {
            showToast('Error: Invalid Base64 string.', 5000);
            outputText.value = '';
        }
    };
    const htmlEntityEncode = () => {
        const tempDiv = document.createElement('div');
        tempDiv.innerText = inputText.value;
        outputText.value = tempDiv.innerHTML;
        saveState();
        showToast('HTML Entities Encoded.');
    };
    const htmlEntityDecode = () => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = inputText.value;
        outputText.value = tempDiv.innerText;
        saveState();
        showToast('HTML Entities Decoded.');
    };

    // Word/Character Tools
    const slugGeneratorBtn = document.getElementById('slugGeneratorBtn');

    const generateSlug = () => {
        const text = inputText.value;
        const slug = text
           .toLowerCase()
           .trim()
           .replace(/[^\w\s-]/g, '') // Remove all non-word chars except spaces and dashes
           .replace(/[\s_-]+/g, '-') // Replace spaces/underscores with single dash
           .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
        outputText.value = slug;
        saveState();
        showToast('Slug generated.');
    };

    // --- Event Listeners ---

    // Input changes
    inputText.addEventListener('input', () => {
        updateCounts();
        saveState(); // Save state on every input change for granular undo
    });

    // General Actions
    copyOutputBtn.addEventListener('click', copyOutput);
    clearInputOutputBtn.addEventListener('click', clearAll);
    pasteInputBtn.addEventListener('click', pasteIntoInput);
    swapTextBtn.addEventListener('click', swapText);
    undoBtn.addEventListener('click', undo);
    redoBtn.addEventListener('click', redo);

    // Text Manipulation
    upperCaseBtn.addEventListener('click', toUpperCase);
    lowerCaseBtn.addEventListener('click', toLowerCase);
    titleCaseBtn.addEventListener('click', toTitleCase);
    sentenceCaseBtn.addEventListener('click', toSentenceCase);
    removeExtraSpacesBtn.addEventListener('click', removeExtraSpaces);
    trimWhitespaceBtn.addEventListener('click', trimWhitespace); // New
    reverseTextBtn.addEventListener('click', reverseText);
    findReplaceBtn.addEventListener('click', findAndReplace);
    textDiffBtn.addEventListener('click', compareText);

    // Line Operations
    textSorterAscBtn.addEventListener('click', () => sortLines(true));
    textSorterDescBtn.addEventListener('click', () => sortLines(false));
    removeDuplicateLinesBtn.addEventListener('click', removeDuplicateLines);
    removeEmptyLinesBtn.addEventListener('click', removeEmptyLines);
    removeDuplicateWordsBtn.addEventListener('click', removeDuplicateWords); // New
    shuffleLinesBtn.addEventListener('click', shuffleLines); // New
    addLineNumbersBtn.addEventListener('click', addLineNumbers);
    removeLineNumbersBtn.addEventListener('click', removeLineNumbers);
    addPrefixSuffixBtn.addEventListener('click', addPrefixSuffix);
    joinLinesBtn.addEventListener('click', joinLines);
    splitLinesBtn.addEventListener('click', splitLines);

    // Tab/Space Conversion
    convertTabsToSpacesBtn.addEventListener('click', convertTabsToSpaces); // New
    convertSpacesToTabsBtn.addEventListener('click', convertSpacesToTabs); // New

    // Content Generation
    loremIpsumBtn.addEventListener('click', generateLoremIpsum);

    // Format Conversion
    markdownToHtmlBtn.addEventListener('click', markdownToHtml);
    htmlToMarkdownBtn.addEventListener('click', htmlToMarkdown);

    // Data Encoding/Decoding
    urlEncodeBtn.addEventListener('click', urlEncode);
    urlDecodeBtn.addEventListener('click', urlDecode);
    base64EncodeBtn.addEventListener('click', base64Encode);
    base64DecodeBtn.addEventListener('click', base64Decode);
    htmlEntityEncodeBtn.addEventListener('click', htmlEntityEncode);
    htmlEntityDecodeBtn.addEventListener('click', htmlEntityDecode);

    // Word/Character Tools
    slugGeneratorBtn.addEventListener('click', generateSlug);

    // Initial setup on page load
    updateCounts();
    saveState(); // Save initial empty state
    updateUndoRedoButtons(); // Initialize undo/redo button states

    // --- Theme Toggle Logic ---
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        body.classList.add(currentTheme);
        themeToggle.textContent = currentTheme === 'dark-mode'? '☀️' : '🌙';
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        body.classList.add('dark-mode');
        themeToggle.textContent = '☀️';
        localStorage.setItem('theme', 'dark-mode');
    }

    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-mode')) {
            body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light-mode');
            themeToggle.textContent = '🌙';
        } else {
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark-mode');
            themeToggle.textContent = '☀️';
        }
    });

    // --- Smooth Scrolling for Navigation ---
    document.querySelectorAll('.main-nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = targetElement.getBoundingClientRect().top;
                const elementPosition = elementRect - bodyRect;
                const offsetPosition = elementPosition - headerHeight - 20; // Added 20px padding

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});