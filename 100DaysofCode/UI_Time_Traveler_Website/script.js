/* ---------------- ERA DATA ---------------- */
const eras = [
    {
        name: "1995",
        class: "era1995",
        info: [
            "HTML 2.0 (RFC 1866) standard",
            "CSS not yet adopted (inline styles dominant)",
            "JavaScript (LiveScript) not yet released",
            "Tables used for layout, not just data",
            "Background images, marquee text, blinking text"
        ],
        whyChanged: {
            html: {
                title: "From Minimal Markup to Basic Structure (HTML 2.0)",
                content: [
                    "HTML 2.0 was the first official standard, laying the groundwork for web pages.",
                    "Elements were primarily for document structure (headings, paragraphs, lists) and hyperlinking.",
                    "There was no real concept of 'styling' beyond basic attributes like `bgcolor` and `align`.",
                    "No JavaScript or CSS meant limited interactivity and visual control."
                ]
            },
            css: {
                title: "The Absence of Standardized Styling",
                content: [
                    "CSS was still in its infancy; the first CSS recommendation wouldn't appear until 1996.",
                    "Web developers relied on browser-specific tags or presentational HTML attributes (`<FONT>`, `BGCOLOR`) for any visual flair.",
                    "This led to inconsistent rendering across browsers and mixed content with presentation."
                ]
            },
            js: {
                title: "JavaScript: Not Yet Born",
                content: [
                    "JavaScript (originally LiveScript) was released late in 1995 but was not widely adopted or understood.",
                    "Web pages were static documents; any interactivity came from server-side scripts or CGI."
                ]
            }
        }
    },
    {
        name: "2000",
        class: "era2000",
        info: [
            "HTML 4.01 / XHTML 1.0 (strictness introduced)",
            "CSS 1.0 gaining traction; CSS 2.0 released",
            "Early DOM manipulation with JavaScript (DHTML)",
            "Layouts still often table-based due to browser inconsistencies",
            "Animated GIFs still popular, Flash starting to emerge"
        ],
        whyChanged: {
            html: {
                title: "Towards Semantic HTML & XML Strictness (HTML 4.01 / XHTML)",
                content: [
                    "HTML 4.01 aimed for better structure and separation of concerns, moving away from presentational attributes.",
                    "XHTML 1.0 introduced stricter XML-like rules (e.g., closing all tags, lowercase tags) for better forward compatibility and parsing.",
                    "Tables were still heavily used for complex page layouts due to better browser support compared to early CSS layouts."
                ]
            },
            css: {
                title: "CSS 1.0 and 2.0: Gaining Control",
                content: [
                    "CSS 1.0 (1996) and CSS 2.0 (1998) brought powerful capabilities for controlling typography, colors, and basic box model properties.",
                    "However, inconsistent browser implementations and bugs often forced developers to use hacks.",
                    "The idea of 'CSS Zen Garden' showcased the power of CSS to completely restyle HTML without changing markup."
                ]
            },
    
            js: {
                title: "DHTML & Basic Interactivity",
                content: [
                    "JavaScript became essential for 'Dynamic HTML' (DHTML), enabling client-side changes without full page reloads.",
                    "Used for form validation, basic animations, showing/hiding elements, and dropdown menus.",
                    "Cross-browser compatibility was a major headache, with different DOM APIs (document.all for IE, document.layers for Netscape)."
                ]
            }
        }
    },
    {
        name: "2005",
        class: "era2005",
        info: [
            "HTML 4.01 / XHTML 1.0 still dominant",
            "CSS 2.1 widely supported (browser wars calming down)",
            "JavaScript for DHTML & early AJAX (Asynchronous JS and XML)",
            "Fixed-width, table-less CSS layouts with floats becoming common",
            "Web 2.0 aesthetics (gradients, rounded corners, shadows via images)"
        ],
        whyChanged: {
            html: {
                title: "Semantic Markup with DIVs (HTML 4.01 / XHTML)",
                content: [
                    "HTML 4.01 and XHTML 1.0 remained the standards.",
                    "Developers started embracing `<div>` elements extensively with `id`s and `class`es to create structured, semantically meaningful sections for CSS layouts.",
                    "The push was to move away from presentational HTML tags and rely solely on CSS for styling."
                ]
            },
            css: {
                title: "CSS-Driven Layouts & Web 2.0 Design",
                content: [
                    "CSS 2.1 was largely implemented consistently across major browsers, making 'table-less layouts' practical with floats.",
                    "The 'Web 2.0' era popularized glossy buttons, gradients (achieved with images), and subtle shadows, pushing CSS's aesthetic boundaries.",
                    "This era cemented CSS as the primary tool for web design, separate from content."
                ]
            },
            js: {
                title: "The AJAX Revolution",
                content: [
                    "AJAX emerged as a game-changer, allowing web pages to update content dynamically without full page reloads.",
                    "This enabled rich, desktop-like web applications (e.g., Google Maps, Gmail).",
                    "Early libraries like Prototype and jQuery began simplifying DOM manipulation and AJAX calls, reducing cross-browser headaches."
                ]
            }
        }
    },
    {
        name: "2010",
        class: "era2010",
        info: [
            "HTML5 specification in draft, but features used (video, audio)",
            "CSS3 modules (borders, shadows, transforms, transitions) gaining support",
            "jQuery dominated JS development, first major MVC frameworks (Backbone.js, AngularJS 1)",
            "Mobile web exploded: responsive design with media queries emerging",
            "Skeuomorphic design popular; web fonts starting to be used."
        ],
        whyChanged: {
            html: {
                title: "HTML5: New Semantics & Multimedia",
                content: [
                    "The HTML5 draft introduced new semantic tags like `<header>`, `<footer>`, `<nav>`, `<article>`, `<section>`, making markup more meaningful.",
                    "Built-in `<video>` and `<audio>` tags ended reliance on Flash for media playback.",
                    "New form inputs (e.g., `email`, `date`) and attributes improved user experience and validation."
                ]
            },
            css: {
                title: "CSS3: Dynamic Styles & Media Queries",
                content: [
                    "CSS3 introduced exciting new modules: `border-radius` for true rounded corners, `box-shadow` for real shadows, `transform` for 2D/3D manipulation, `transitions` for animations.",
                    "Crucially, `@media` queries enabled Responsive Web Design, allowing layouts to adapt to different screen sizes for mobile devices.",
                    "This marked a shift from fixed-width designs to fluid, adaptive experiences."
                ]
            },
            js: {
                title: "jQuery Dominance & MVC Frameworks",
                content: [
                    "jQuery became the de-facto standard for DOM manipulation and AJAX, simplifying client-side scripting across browsers.",
                    "The rise of single-page applications (SPAs) led to early MVC (Model-View-Controller) frameworks like Backbone.js and AngularJS 1.",
                    "These frameworks helped manage complex application states, moving logic from the server to the client."
                ]
            }
        }
    },
    {
        name: "2015",
        class: "era2015",
        info: [
            "HTML5 standard finalized, widely adopted",
            "CSS3 features broadly supported (Flexbox, Grid emerging)",
            "ES6 (ES2015) JavaScript features (arrow functions, classes, modules)",
            "Front-end framework boom (React, Angular 2+, Vue.js)",
            "Mobile-first development, flat UI design"
        ],
        whyChanged: {
            html: {
                title: "HTML5: The Modern Web Standard",
                content: [
                    "HTML5 became the undisputed standard, powering almost all modern web content.",
                    "Its semantic elements were used for accessibility and SEO, guiding browsers and screen readers.",
                    "New APIs like Web Storage (localStorage) and Geolocation added powerful client-side capabilities."
                ]
            },
            css: {
                title: "Advanced Layouts (Flexbox & Grid) & Flat Design",
                content: [
                    "Flexbox gained widespread support, revolutionizing one-dimensional layout management (rows or columns).",
                    "CSS Grid emerged as the powerful solution for two-dimensional layouts, enabling complex, responsive designs without hacks.",
                    "Flat UI design gained popularity, moving away from gradients and shadows towards clean, minimalist aesthetics."
                ]
            },
            js: {
                title: "ES6 & the Rise of Component-Based UI",
                content: [
                    "ES6 (ECMAScript 2015) introduced major language features like arrow functions, classes, `let`/`const`, and native modules, making JavaScript more powerful and readable.",
                    "React.js popularized the component-based architecture and virtual DOM, changing how UI was built.",
                    "Angular 2+ and Vue.js also offered robust solutions for building large-scale SPAs, ushering in the era of modern front-end development."
                ]
            }
        }
    },
    {
        name: "2020",
        class: "era2020",
        info: [
            "HTML Living Standard (continuous evolution)",
            "CSS Custom Properties, Grid ubiquitous, Utility-first CSS (Tailwind)",
            "ESNext (TypeScript, WebAssembly, async/await), bundlers (Webpack, Rollup)",
            "PWAs (Progressive Web Apps), Headless CMS, JAMstack",
            "Accessibility (A11y) and Performance as core concerns"
        ],
        whyChanged: {
            html: {
                title: "HTML Living Standard: A Continuous Evolution",
                content: [
                    "HTML moved to a 'Living Standard' model, meaning it continuously evolves rather than having distinct versions.",
                    "Emphasis on accessibility (ARIA attributes) and microdata for semantic enrichment.",
                    "Web Components gained traction for encapsulating reusable UI."
                ]
            },
            css: {
                title: "Dynamic CSS with Custom Properties & Utility-First",
                content: [
                    "CSS Custom Properties (variables) enabled dynamic styling, theming, and better maintainability.",
                    "CSS Grid became fully mainstream for complex page layouts, alongside Flexbox.",
                    "Utility-first CSS frameworks like Tailwind CSS gained immense popularity for rapid development and highly customizable designs.",
                    "Container Queries emerged as a highly anticipated solution for component-level responsiveness."
                ]
            },
            js: {
                title: "Mature Ecosystem: TypeScript, PWAs & Bundlers",
                content: [
                    "TypeScript, offering static typing, became widely adopted for large JavaScript projects, improving code quality and maintainability.",
                    "WebAssembly (Wasm) allowed near-native performance for critical parts of web applications.",
                    "Progressive Web Apps (PWAs) combined the best of web and native apps (offline support, push notifications, installability).",
                    "Modern bundlers (Webpack, Rollup, Vite) became essential for optimizing JavaScript for production."
                ]
            }
        }
    },
    {
        name: "2025",
        class: "era2025",
        info: [
            "HTML Living Standard with new interactive elements",
            "Advanced CSS (Cascade Layers, `@scope`, interop with JS)",
            "ESNext (WebGPU, AI/ML in browser, server-side JS rendering)",
            "Web Components and Island Architectures (Astro, Next.js)",
            "Immersive Web (VR/AR), sustainability, privacy-focused design"
        ],
        whyChanged: {
            html: {
                title: "The Immersive & Interactive Web (HTML Living Standard)",
                content: [
                    "HTML continues to evolve, potentially incorporating more declarative ways to define complex, interactive UI.",
                    "Focus on Web Components for true encapsulation and reusability.",
                    "New elements and attributes for VR/AR experiences (WebXR) and enhanced accessibility."
                ]
            },
            css: {
                title: "Hyper-Dynamic & Intelligent CSS",
                content: [
                    "Cascade Layers (`@layer`) provided fine-grained control over CSS specificity, solving long-standing cascade issues.",
                    "`@scope` improved component-level styling by scoping styles to specific DOM subtrees.",
                    "Interoperability between CSS and JS for dynamic values and effects became seamless.",
                    "AI-powered design tools assist in generating and optimizing CSS."
                ]
            },
            js: {
                title: "Beyond JavaScript: WebGPU & AI/ML in Browser",
                content: [
                    "WebGPU enables high-performance 3D graphics and compute on the web, unlocking advanced gaming and data visualization.",
                    "AI/Machine Learning models run directly in the browser (TensorFlow.js) for real-time personalization and interactions.",
                    "Server-Side Rendering (SSR) and hydration techniques became standard for performance and SEO in framework-based apps.",
                    "The lines blur between web, desktop, and mobile applications."
                ]
            }
        }
    }
];

/* ---------------- CODE EXAMPLES ---------------- */
const codeExamples = {
    '1995': {
        html: `<FONT COLOR="#FF0000" DATA-TIP="Text directly styled with font tag.">Welcome</FONT><BR>
<IMG SRC="ball.gif" WIDTH="50" HEIGHT="50" DATA-TIP="Animated GIF. Very common in 90s.">
<MARQUEE DATA-TIP="Scrolling text! A very popular, non-standard tag.">Hello World!</MARQUEE>
<HR DATA-TIP="Horizontal rule for visual separation.">
<A HREF="about.html" DATA-TIP="Hyperlink to another page.">About Me</A>
<BR>
<TABLE BORDER="1" BGCOLOR="#00FFFF" DATA-TIP="Tables were used for layout, not just data.">
    <TR><TD>Cell 1</TD><TD>Cell 2</TD></TR>
</TABLE>`,
        css: `/* CSS was not standard or widely supported in 1995.
   Styling was done directly within HTML tags (inline styles)
   or with browser-specific attributes.
   
   Example (not real CSS, but how it felt to style):
   <BODY BGCOLOR="YELLOW"> -> Sets background color
   <H1 ALIGN="CENTER"> -> Centers heading */`,
        js: `/* JavaScript (originally LiveScript, then Netscape-funded)
   was introduced late in 1995 but was not widely used for
   complex web interactivity.
   
   Typical uses were very basic, like showing an alert. */

function greetUser() {
    alert("Welcome to my awesome 1995 page!");
}

// This would typically be called directly from an HTML event:
// <BODY ONLOAD="greetUser()">`
    },
    '2000': {
        html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" DATA-TIP="Declaring character encoding.">
    <title DATA-TIP="Page title shown in browser tab.">My Portal</title>
    <link rel="stylesheet" type="text/css" href="style.css" DATA-TIP="Linking to an external CSS stylesheet.">
</head>
<body>
    <div id="header" DATA-TIP="A generic division, heavily used for layout.">
        <h1 DATA-TIP="Main heading for the page.">Welcome to My 2000s Web Portal</h1>
    </div>
    <div id="content" DATA-TIP="Another division for the main content area.">
        <p>This page uses <b DATA-TIP="Bold text using a semantic tag.">CSS</b> for layout, not tables!</p>
        <button onclick="showAlert()" DATA-TIP="Inline JavaScript event handler.">Click Me!</button>
    </div>
</body>
</html>`,
        css: `/* style.css */
body {
    font-family: Arial, sans-serif;
    margin: 0;
    background-color: #e0f0ff;
}
#header {
    background-color: #003366;
    color: white;
    padding: 15px;
    text-align: center;
    border-bottom: 3px solid #6699cc;
}
h1 {
    margin: 0;
    font-size: 2em;
}
#content {
    width: 760px; /* Fixed width layout common to this era. */
    margin: 20px auto; /* Centers the content block. */
    padding: 20px;
    background-color: white;
    border: 1px solid #ccc;
    box-shadow: 2px 2px 5px rgba(0,0,0,0.2); /* Basic shadow. */
}
button {
    background-color: #0066cc;
    color: white;
    padding: 8px 15px;
    border: 1px solid #003399;
    border-radius: 3px;
    cursor: pointer;
}`,
        js: `// script.js (or often inline <script> tags)
function showAlert() {
    alert("DHTML is dynamic!"); // Simple alert from JavaScript.
}

// Basic example of changing elements with DHTML
function changeHeaderColor() {
    var header = document.getElementById('header');
    if (header) {
        header.style.backgroundColor = '#99ccff'; // Direct style manipulation.
    }
}
// This might be called from an event:
// <DIV ID="header" ONMOUSEOVER="changeHeaderColor()">`
    },
    '2005': {
        html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" DATA-TIP="XHTML requires strict well-formedness.">
    <title>Web 2.0 Blog</title>
    <link rel="stylesheet" type="text/css" href="style.css" DATA-TIP="External CSS for separation of concerns.">
    <script type="text/javascript" src="script.js" DATA-TIP="External JavaScript."></script>
</head>
<body>
    <div id="wrapper" DATA-TIP="Main wrapper for fixed-width layout.">
        <div id="header" DATA-TIP="Header section for branding.">
            <h1>My Awesome Web 2.0 Blog</h1>
        </div>
        <div id="nav" DATA-TIP="Navigation using an unordered list.">
            <ul>
                <li><a href="#">Home</a></li>
                <li><a href="#">About</a></li>
                <li><a href="#">Contact</a></li>
            </ul>
        </div>
        <div id="content" DATA-TIP="Main content area, floated left.">
            <h2>Latest Post Title</h2>
            <p class="post-meta">Posted by Admin on <span>Jan 15, 2005</span></p>
            <p>This is the content of my latest blog post. We are now using semantic HTML elements like div for layout, and separating content from presentation with CSS.</p>
            <button id="likeBtn" DATA-TIP="Button to simulate a 'Like' action, often with AJAX.">Like (0)</button>
        </div>
        <div id="sidebar" DATA-TIP="Sidebar for secondary content, floated right.">
            <h3>Categories</h3>
            <ul>
                <li><a href="#">Web Design</a></li>
                <li><a href="#">Technology</a></li>
            </ul>
        </div>
        <div id="footer" DATA-TIP="Footer clears floats to contain content.">
            <p>&copy; 2005 My Blog. All Rights Reserved.</p>
        </div>
    </div>
</body>
</html>`,
        css: `/* style.css */
body {
    font-family: Verdana, sans-serif;
    margin: 0;
    background: #f0f8ff;
    color: #333;
}
#wrapper {
    width: 960px; /* Fixed width layout. */
    margin: 0 auto;
    background: white;
    border: 1px solid #ccc;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
}
#header {
    background: linear-gradient(to bottom, #dbe9f6, #c7d5df); /* Gradient via CSS, not images. */
    padding: 20px;
    text-align: center;
    border-bottom: 1px solid #aebac6;
}
#nav ul {
    list-style: none;
    padding: 0;
    margin: 0;
    background: #4b6a9e;
    overflow: hidden; /* Micro-clearfix for floating list items. */
}
#nav li {
    float: left; /* Horizontal navigation. */
}
#nav a {
    display: block;
    color: white;
    text-decoration: none;
    padding: 10px 15px;
    border-right: 1px solid #3a5682;
}
#content {
    float: left; /* Main content floated left. */
    width: 650px;
    padding: 20px;
}
#sidebar {
    float: right; /* Sidebar floated right. */
    width: 250px;
    padding: 20px;
    background: #eef5fa;
    border-left: 1px solid #e0e0e0;
}
#footer {
    clear: both; /* Clears floats from #content and #sidebar. */
    background: #dbe9f6;
    padding: 15px;
    text-align: center;
    border-top: 1px solid #aebac6;
}`,
        js: `// script.js
window.onload = function() {
    var likeButton = document.getElementById('likeBtn');
    var likeCount = 0;

    if (likeButton) {
        likeButton.onclick = function() { // Direct DOM event handler.
            likeCount++;
            likeButton.innerHTML = 'Like (' + likeCount + ')';
            
            // This is a conceptual AJAX call using XMLHttpRequest.
            // new XMLHttpRequest().open('GET', '/api/like?id=postId', true);
        };
    }

    // Basic DHTML example for visual flair
    var header = document.getElementById('header');
    if (header) {
        header.onmouseover = function() {
            this.style.backgroundColor = '#aebac6';
        };
        header.onmouseout = function() {
            this.style.backgroundColor = ''; // Reset
        };
    }
};`
    },
    '2010': {
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" DATA-TIP="The viewport meta tag became essential for responsive design.">
    <title>Skeuomorphic Design</title>
    <link rel="stylesheet" href="style.css" DATA-TIP="External stylesheet.">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js" DATA-TIP="jQuery CDN link - extremely popular in this era."></script>
    <script src="script.js" defer DATA-TIP="Defer attribute ensures script runs after HTML parsing."></script>
</head>
<body>
    <header class="main-header" DATA-TIP="New HTML5 semantic tag for page header.">
        <h1>My Awesome App</h1>
        <nav class="main-nav" DATA-TIP="New HTML5 semantic tag for navigation links.">
            <ul>
                <li><a href="#">Dashboard</a></li>
                <li><a href="#">Settings</a></li>
                <li><a href="#">About</a></li>
            </ul>
        </nav>
    </header>

    <main class="container" DATA-TIP="New HTML5 semantic tag for main content.">
        <section class="widget" DATA-TIP="New HTML5 semantic tag for a thematic grouping of content.">
            <h2>Welcome Back!</h2>
            <p>Your latest activity summary.</p>
            <button id="fetchDataBtn" class="cool-button" DATA-TIP="Button with rich CSS3 styling and jQuery click handler.">Fetch Data</button>
        </section>
        <article class="news-feed" DATA-TIP="New HTML5 semantic tag for self-contained content.">
            <h3>Recent News</h3>
            <p>New CSS3 features are changing web design.</p>
        </article>
    </main>

    <footer class="main-footer" DATA-TIP="New HTML5 semantic tag for page footer.">
        <p>&copy; 2010. Powered by HTML5, CSS3, jQuery.</p>
    </footer>
</body>
</html>`,
        css: `/* style.css */
body {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    margin: 0;
    background-color: #f0f0f0;
}
.main-header {
    background: linear-gradient(to bottom, #6d8ba6, #4f6e8c); /* Gradient background. */
    color: white;
    padding: 20px;
    text-align: center;
    border-bottom: 1px solid #3f5872;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}
.main-nav ul {
    list-style: none;
    padding: 0;
    margin-top: 15px;
}
.main-nav li {
    display: inline-block; /* Horizontal nav with inline-block. */
    margin: 0 10px;
}
.main-nav a {
    color: white;
    text-decoration: none;
    font-weight: bold;
    text-shadow: 0 1px 0 rgba(0,0,0,0.3);
}
.container {
    max-width: 980px; /* Still mostly fixed-width, but media queries starting. */
    margin: 20px auto;
    padding: 0 20px;
    display: block; /* No Flexbox yet. */
}
.widget,.news-feed {
    background: linear-gradient(to bottom, #ffffff, #f0f0f0); /* Skeuomorphic gradient. */
    border: 1px solid #ccc;
    border-radius: 8px; /* CSS3 border-radius! */
    box-shadow: 0 2px 5px rgba(0,0,0,0.15); /* CSS3 box-shadow! */
    padding: 20px;
    margin-bottom: 20px;
}
.cool-button {
    background: linear-gradient(to bottom, #7db9e8 0%,#207acd 100%); /* Blue gradient button. */
    color: white;
    padding: 10px 20px;
    border: 1px solid #0a528e;
    border-radius: 5px;
    text-shadow: 0 1px 0 rgba(0,0,0,0.3);
    cursor: pointer;
    transition: background 0.3s ease; /* CSS3 transition. */
}
.cool-button:hover {
    background: linear-gradient(to bottom, #207acd 0%,#0a528e 100%);
}
@media (max-width: 768px) { /* Early media query for basic responsiveness. */
   .container {
        width: auto;
        padding: 0 10px;
    }
   .main-nav li {
        display: block;
        margin: 5px 0;
    }
}`,
        js: `// script.js
$(document).ready(function() { // jQuery's document ready function.
    $('#fetchDataBtn').on('click', function() { // jQuery event handler.
        var button = $(this); // Cache jQuery object.
        button.text('Fetching...');
        
        // jQuery AJAX call, much simpler than XMLHttpRequest.
        $.ajax({
            url: 'api/data',
            method: 'GET',
            success: function(data) {
                // Assuming data is { message: "Data loaded!" }
                $('.news-feed p').text(data.message);
                button.text('Data Loaded!');
                button.addClass('success'); // Add a class for styling.
            },
            error: function() {
                $('.news-feed p').text('Error loading data.');
                button.text('Failed!');
                button.addClass('error');
            }
        });
    });

    // Basic animation with jQuery
    $('.widget').hover(
        function() { $(this).stop().animate({ 'margin-top': '-5px' }, 200); },
        function() { $(this).stop().animate({ 'margin-top': '0px' }, 200); }
    );
});`
    },
    '2015': {
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern Blog (Responsive)</title>
    <link rel="stylesheet" href="style.css">
    <script src="script.js" defer></script>
</head>
<body>
    <header class="main-header" DATA-TIP="Semantic HTML5 header.">
        <h1>My Responsive Blog</h1>
        <nav class="main-nav">
            <button class="menu-toggle" aria-label="Toggle navigation" DATA-TIP="Hamburger menu for mobile, hidden on desktop.">☰</button>
            <ul class="nav-links">
                <li><a href="#">Home</a></li>
                <li><a href="#">Articles</a></li>
                <li><a href="#">About</a></li>
                <li><a href="#">Contact</a></li>
            </ul>
        </nav>
    </header>

    <main class="container" DATA-TIP="Main content area, often styled with Flexbox.">
        <article class="blog-post" DATA-TIP="Self-contained content, like a blog post.">
            <h2>Understanding Flexbox</h2>
            <p class="post-meta">Published on <time datetime="2015-08-20" DATA-TIP="Semantic time tag.">August 20, 2015</time></p>
            <p>Flexbox (Flexible Box Module) is a one-dimensional layout method for arranging items in rows or columns. Items flex to fill additional space and shrink to fit into smaller spaces.</p>
            <div class="tags">
                <span>#CSS3</span> <span>#Layout</span> <span>#Responsive</span>
            </div>
            <button class="read-more-btn" DATA-TIP="Button to trigger a JS event.">Read More</button>
        </article>

        <aside class="sidebar" DATA-TIP="Sidebar for secondary content, like related posts.">
            <h3>Recent Posts</h3>
            <ul>
                <li><a href="#">CSS Grid vs Flexbox</a></li>
                <li><a href="#">JavaScript ES6 Features</a></li>
            </ul>
        </aside>
    </main>

    <footer class="main-footer" DATA-TIP="Semantic HTML5 footer.">
        <p>&copy; 2015 Responsive Blog. All rights reserved.</p>
    </footer>
</body>
</html>`,
        css: `/* style.css */
body {
    font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
    margin: 0;
    background-color: #f0f2f5;
    color: #333;
    line-height: 1.6;
}
.main-header {
    background-color: #333;
    color: white;
    padding: 15px 20px;
    display: flex; /* Flexbox for header alignment. */
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.main-nav ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex; /* Flexbox for horizontal navigation. */
}
.main-nav a {
    color: white;
    text-decoration: none;
    padding: 10px 15px;
    display: block;
    transition: background-color 0.3s ease;
}
.container {
    display: flex; /* Flexbox for main content and sidebar. */
    max-width: 1100px;
    margin: 20px auto;
    padding: 0 20px;
    gap: 20px; /* CSS Gap property. */
}
.blog-post {
    flex: 3; /* Flex-grow property: takes 3/4 of space. */
    background-color: white;
    padding: 25px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.read-more-btn {
    background-color: #007bff;
    color: white;
    padding: 10px 18px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}
.sidebar {
    flex: 1; /* Takes 1/4 of space. */
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
@media (max-width: 768px) { /* Media query for responsive layout. */
  .main-nav ul {
        flex-direction: column; /* Stack nav items on mobile. */
        display: none;
    }
  .menu-toggle {
        display: block; /* Show hamburger menu on mobile. */
        background-color: transparent;
        color: white;
        font-size: 1.5em;
        padding: 0;
    }
  .container {
        flex-direction: column; /* Stack main content and sidebar on mobile. */
    }
}`,
        js: `// script.js
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => { // Modern event listener.
            navLinks.classList.toggle('active'); // Toggle class for mobile nav.
        });
    }

    const readMoreBtn = document.querySelector('.read-more-btn');
    if (readMoreBtn) {
        readMoreBtn.addEventListener('click', (event) => {
            alert('Navigating to full article...');
            event.preventDefault(); // Prevent default button behavior.
        });
    }

    // ES6 Class example
    class BlogPost {
        constructor(title, author) {
            this.title = title;
            this.author = author;
        }
        summary() { // Class method.
            return \`Article: \${this.title} by \${this.author}\`; // Template literals.
        }
    }
    const myPost = new BlogPost('Web Components', 'Dev Admin');
    console.log(myPost.summary()); // \`Article: Web Components by Dev Admin\`
});`
    },
    '2020': {
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PWA & Components</title>
    <link rel="stylesheet" href="style.css">
    <script type="module" src="script.js" DATA-TIP="JavaScript modules allow organizing code into separate files."></script>
    <link rel="manifest" href="/manifest.json" DATA-TIP="Manifest file for Progressive Web App (PWA) functionality.">
</head>
<body>
    <div id="root" DATA-TIP="Common root element for modern JavaScript frameworks (React, Vue, Angular).">
        <!-- React/Vue/Angular App will hydrate here -->
        <header class="app-header" DATA-TIP="Header with utility classes (Tailwind CSS example).">
            <h1 class="text-3xl font-bold">My PWA</h1>
            <nav>
                <a href="#" class="btn-primary" DATA-TIP="Button styled with a utility-first CSS class.">Dashboard</a>
                <a href="#" class="btn-secondary">Settings</a>
            </nav>
        </header>

        <main class="app-main">
            <section class="card" DATA-TIP="Component-like card structure.">
                <h2>Welcome, <span id="username" DATA-TIP="Placeholder for dynamically loaded username.">Guest</span>!</h2>
                <p>Enjoy your offline-first experience.</p>
                <button id="installPWA" class="btn-primary" DATA-TIP="Button to prompt PWA installation.">Install App</button>
            </section>
            
            <section class="card" DATA-TIP="Another section, demonstrating component reusability.">
                <h3>Latest Updates</h3>
                <ul id="updateList">
                    <!-- Updates loaded via AJAX -->
                </ul>
            </section>
        </main>
    </div>
</body>
</html>`,
        css: `/* style.css */
/* Utility-first CSS (conceptual, inspired by Tailwind CSS)
   or CSS Custom Properties for theming */

:root { /* CSS Custom Properties for theming */
    --primary-color: #4f46e5;
    --secondary-color: #6366f1;
    --text-color: #1f2a37;
    --bg-color: #f7f7f7;
    --card-bg: white;
}

body {
    font-family: 'Inter', sans-serif;
    margin: 0;
    background-color: var(--bg-color);
    color: var(--text-color);
    line-height: 1.5;
}
.app-header {
    background-color: var(--primary-color);
    color: white;
    padding: 1rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
.text-3xl { font-size: 1.875rem; } /* Utility class */
.font-bold { font-weight: 700; } /* Utility class */

.btn-primary,.btn-secondary { /* Button styles */
    display: inline-block;
    padding: 0.75rem 1.25rem;
    border-radius: 0.375rem; /* Rounded corners */
    text-decoration: none;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
}
.btn-primary {
    background-color: var(--primary-color);
    color: white;
    border: 1px solid var(--primary-color);
}
.btn-primary:hover {
    background-color: #4338ca;
    border-color: #4338ca;
}
.btn-secondary {
    background-color: transparent;
    color: var(--primary-color);
    border: 1px solid var(--primary-color);
    margin-left: 0.5rem;
}
.btn-secondary:hover {
    background-color: var(--primary-color);
    color: white;
}

.app-main {
    max-width: 1024px;
    margin: 2rem auto;
    padding: 0 1.5rem;
    display: grid; /* CSS Grid for complex layouts. */
    grid-template-columns: 1fr 1fr; /* Two equal columns. */
    gap: 1.5rem;
}
.card {
    background-color: var(--card-bg);
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06);
    padding: 1.5rem;
}
@media (max-width: 768px) {
   .app-main {
        grid-template-columns: 1fr; /* Single column on mobile. */
    }
}
`,
        js: `// script.js (Often TypeScript compiled to JS, using ES Modules)
// import { useState, useEffect } from 'react'; // Conceptual import from React/Vue

// Modern async/await for data fetching
async function fetchUpdates() {
    try {
        const response = await fetch('/api/updates'); // Fetch data from API.
        if (!response.ok) throw new Error('Failed to fetch updates');
        const data = await response.json(); // Parse JSON response.
        const updateList = document.getElementById('updateList');
        if (updateList) {
            updateList.innerHTML = data.updates.map(item => \`<li>\${item.message}</li>\`).join('');
        }
    } catch (error) {
        console.error('Error loading updates:', error);
    }
}

// Service Worker for PWA offline capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
           .then(registration => console.log('SW registered: ', registration))
           .catch(registrationError => console.log('SW registration failed: ', registrationError));
    });
}

// User greeting (dynamic content)
document.addEventListener('DOMContentLoaded', () => {
    const usernameSpan = document.getElementById('username');
    if (usernameSpan) {
        const userName = localStorage.getItem('userName') || 'Visitor'; // Local storage.
        usernameSpan.textContent = userName;
    }
    fetchUpdates(); // Load updates on page load.

    const installPWAButton = document.getElementById('installPWA');
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault(); // Prevent Chrome 67 and earlier from automatically showing the prompt.
        deferredPrompt = e; // Stash the event so it can be triggered later.
        installPWAButton.classList.remove('hidden'); // Show your custom install button.
    });
    installPWAButton.addEventListener('click', (e) => {
        if (deferredPrompt) {
            deferredPrompt.prompt(); // Show the install prompt.
            deferredPrompt.userChoice.then((choiceResult) => {
                console.log(choiceResult.outcome === 'accepted'? 'User accepted PWA install' : 'User dismissed PWA install');
                deferredPrompt = null;
            });
        }
    });
});`
    },
    '2025': {
        html: `<div id="root" DATA-TIP="The root of a modern, component-based application, potentially built with Web Components or a framework.">
    <header class="header-2025">
        <h1 class="h1-2025">🌌 Beyond the Browser: AI-Powered Web</h1>
        <nav class="nav-2025">
            <button class="nav-btn-2025" onclick="alert('AI Dashboard Loaded!')">AI Dashboard</button>
            <button class="nav-btn-2025" onclick="alert('Settings Panel Opened!')">Settings</button>
        </nav>
    </header>

    <main class="main-2025">
        <section class="card-2025" DATA-TIP="Glassmorphism card for content.">
            <h2>✨ Welcome, <span id="user-name-2025" DATA-TIP="Dynamically updated user name using advanced client-side state management.">Traveller</span>!</h2>
            <p>Your personalized feed is powered by real-time neural network analysis.</p>
            <button class="action-btn-2025" onclick="alert('Interacting with WebGPU (conceptual)!')">Engage WebGPU</button>
        </section>
        
        <section class="card-2025" DATA-TIP="Another section showcasing advanced UI.">
            <h2>💡 Smart Suggestions</h2>
            <p>Based on your recent interactions, we recommend these experiences:</p>
            <ul id="suggestions-list-2025" DATA-TIP="List populated with AI-generated suggestions.">
                <!-- AI-generated suggestions -->
            </ul>
        </section>
    </main>

    <footer class="footer-2025">
        <p>&copy; 2025 MetaWeb. Powered by Quantum AI. <a href="#" onclick="alert('Privacy policy loaded.')">Privacy</a></p>
    </footer>
</div>`,
        css: `/* style.css */
/* Advanced CSS with custom properties, cascade layers, @scope, and future concepts */

@layer base, components, utilities; /* Cascade Layers for order of precedence */

:root { /* CSS Custom Properties (variables) */
    --color-primary: #00f2fe;
    --color-secondary: #4facfe;
    --color-text: #e0e0e0;
    --bg-gradient: linear-gradient(135deg, var(--color-secondary), var(--color-primary));
    --glass-bg: rgba(255, 255, 255, 0.1);
    --glass-border: rgba(255, 255, 255, 0.18);
    --glass-blur: 12px;
}

@layer base {
    body {
        font-family: 'Poppins', sans-serif;
        margin: 0;
        background: var(--bg-gradient);
        color: var(--color-text);
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
    }
}

@layer components {
   .header-2025,.main-2025,.footer-2025 {
        background: var(--glass-bg);
        backdrop-filter: blur(var(--glass-blur));
        border: 1px solid var(--glass-border);
        border-radius: 15px;
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        padding: 20px;
        margin: 10px;
        color: var(--color-text);
    }
   .header-2025 {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        border-bottom: none; /* remove for glass effect */
    }
   .h1-2025 {
        font-size: 2.5em;
        text-shadow: 0 0 10px rgba(var(--color-primary), 0.5);
    }
   .nav-2025.nav-btn-2025 {
        background: rgba(255,255,255,0.1);
        border: 1px solid rgba(255,255,255,0.2);
        color: white;
        padding: 10px 15px;
        border-radius: 8px;
        backdrop-filter: blur(5px);
        margin-left: 10px;
        transition: background 0.3s;
    }
   .nav-2025.nav-btn-2025:hover {
        background: rgba(255,255,255,0.2);
    }

   .main-2025 {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
        width: 90vw;
        max-width: 1200px;
    }
   .card-2025 {
        background: rgba(255, 255, 255, 0.08); /* Slightly more transparent */
        backdrop-filter: blur(calc(var(--glass-blur) / 1.5));
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 12px;
        padding: 25px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
   .card-2025 h2 {
        color: var(--color-primary);
        font-size: 1.8em;
    }
   .action-btn-2025 {
        background: linear-gradient(45deg, var(--color-primary), var(--color-secondary));
        color: white;
        padding: 12px 25px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        box-shadow: 0 0 15px rgba(var(--color-primary), 0.4);
        transition: all 0.3s ease;
        margin-top: 20px;
    }
   .action-btn-2025:hover {
        transform: translateY(-2px) scale(1.02);
        box-shadow: 0 0 20px rgba(var(--color-primary), 0.6);
    }
   .footer-2025 {
        text-align: center;
        margin-top: 20px;
        font-size: 0.9em;
        border-top: none;
    }
   .footer-2025 a {
        color: var(--color-primary);
        text-decoration: none;
        transition: color 0.3s;
    }
   .footer-2025 a:hover {
        color: var(--color-secondary);
        text-decoration: underline;
    }

    /* Conceptual @scope for component isolation */
    /* @scope (.card-2025) {
       .title { color: hotpink; }
    } */

    /* Conceptual Container Query */
    /* @container (min-width: 500px) {
       .card-2025 p {
            font-size: 1.1em;
        }
    } */
}
`,
        js: `// script.js (Often TypeScript, using WebAssembly, WebGPU, and advanced frameworks)

// Conceptual WebGPU or WebXR integration
async function initWebGPU() {
    if (!navigator.gpu) {
        console.warn("WebGPU not supported on this browser.");
        return;
    }
    // const adapter = await navigator.gpu.requestAdapter();
    // const device = await adapter.requestDevice();
    console.log("WebGPU initialized (conceptually).");
}

// AI/ML in browser (TensorFlow.js conceptual example)
async function getAISuggestions(userName) {
    // const model = await tf.loadLayersModel('localstorage://my-recommendation-model');
    // const prediction = model.predict(tf.tensor2d([userId], [1, 1]));
    const suggestions = [
        \`Explore advanced quantum cryptography, \${userName}\`,
        'Participate in the latest Metaverse fashion show',
        'Learn about sustainable Web3 practices',
        'Your next recommended experience: Zero-latency VR stream'
    ];
    return new Promise(resolve => setTimeout(() => resolve(suggestions), 500)); // Simulate AI processing
}

document.addEventListener('DOMContentLoaded', async () => {
    initWebGPU(); // Initialize WebGPU

    const userNameSpan = document.getElementById('user-name-2025');
    let userName = localStorage.getItem('userName-2025') || 'Traveller';
    if (userNameSpan) {
        userNameSpan.textContent = userName;
    }

    // Simulate AI-driven content loading
    const suggestionsList = document.getElementById('suggestions-list-2025');
    if (suggestionsList) {
        const aiSuggestions = await getAISuggestions(userName);
        suggestionsList.innerHTML = aiSuggestions.map(s => \`<li>\${s}</li>\`).join('');
    }

    // Advanced event delegation / framework reactivity (conceptual)
    document.body.addEventListener('click', (event) => {
        if (event.target.classList.contains('action-btn-2025')) {
            console.log('Advanced micro-interaction detected!');
            // Frameworks would handle state changes and re-renders here.
        }
    });

    // Web Components are often used:
    // class CustomButton extends HTMLElement {
    // constructor() { super();... }
    // }
    // customElements.define('custom-button', CustomButton);
});`
    }
};

/* ---------------- ELEMENTS ---------------- */
const slider = document.getElementById("yearSlider");
const info = document.getElementById("infoPanel");
const mainConceptTitle = document.getElementById("mainConceptTitle");
const eraIntroTitle = document.getElementById("eraIntroTitle");
const eraIntroText = document.getElementById("eraIntroText");
const whyChangedTitle = document.getElementById("whyChangedTitle");
const whyChangedContent = document.getElementById("whyChangedContent");
const loadingScreen = document.getElementById("loadingScreen");
const darkModeToggle = document.getElementById("darkModeToggle");

const htmlCodeDisplay = document.getElementById("html-code");
const cssCodeDisplay = document.getElementById("css-code");
const jsCodeDisplay = document.getElementById("js-code");
const livePreviewWrapper = document.getElementById("livePreviewWrapper");

let currentEraIndex = parseInt(localStorage.getItem('currentEraIndex')) || 4; // Default to 2015
let currentPreviewType = localStorage.getItem('currentPreviewType') || 'desktop'; // Load from local storage
let currentConceptKey = localStorage.getItem('currentConceptKey') || 'html'; // Default to HTML concept
let isDarkMode = localStorage.getItem('darkMode') === 'true';

/* ---------------- FUNCTIONS ---------------- */

function showLoadingScreen() {
    loadingScreen.classList.remove('hidden');
}

function hideLoadingScreen() {
    loadingScreen.classList.add('hidden');
}

function updateEra(index) {
    showLoadingScreen();
    setTimeout(() => {
        currentEraIndex = index;
        localStorage.setItem('currentEraIndex', index);

        // Remove all era classes
        document.body.classList.remove(...eras.map(e => e.class));
        
        document.body.classList.add("warp");
        setTimeout(() => {
            document.body.classList.remove("warp");
        }, 600); // Duration of the warp animation

        document.body.classList.add(eras[index].class);

        updateInfo(index);
        loadConcept(currentConceptKey); // Load content for the current concept
        hideLoadingScreen();
    }, 100);
}

function updateInfo(index) {
    let html = `<h2>${eras[index].name}: Key Characteristics</h2><ul>`;

    eras[index].info.forEach(item => {
        html += `<li>${item}</li>`;
    });

    html += "</ul>";
    info.innerHTML = html;
}

function setPreview(type) {
    currentPreviewType = type;
    localStorage.setItem('currentPreviewType', type);

    document.body.classList.remove(
        "preview-desktop",
        "preview-tablet",
        "preview-mobile"
    );
    document.body.classList.add("preview-" + type);
}

function randomEra() {
    showLoadingScreen();
    setTimeout(() => {
        let r;
        do {
            r = Math.floor(Math.random() * eras.length);
        } while (r === currentEraIndex);

        slider.value = r;
        updateEra(r);
        hideLoadingScreen();
    }, 200);
}

// --- Tooltip & Syntax Highlighting ---
function processCodeForDisplay(codeString, lang) {
    // Basic regex to find DATA-TIP attributes. This might need refinement for complex cases.
    return codeString.split('\\n').map(line => {
        const tipMatch = line.match(/DATA-TIP="([^"]*)"/);
        if (tipMatch) {
            const tipText = tipMatch[1];
            // Remove DATA-TIP from the displayed code
            const cleanedLine = line.replace(/DATA-TIP="[^"]*"/, '').trim();
            // Wrap the line for tooltip targeting
            return `<span class="code-line">${cleanedLine}<span class="code-tooltip">${tipText}</span></span>`;
        }
        return `<span class="code-line">${line}</span>`;
    }).join('\\n');
}

function loadConcept(key) {
    currentConceptKey = key;
    localStorage.setItem('currentConceptKey', key);

    const eraName = eras[currentEraIndex].name;
    const example = codeExamples[eraName];
    const whyChangedData = eras[currentEraIndex].whyChanged[key];

    let conceptTitle = "";
    let eraIntro = "";
    let eraIntroDesc = "";

    switch(key) {
        case 'html':
            conceptTitle = "HTML Structure";
            eraIntro = `${eraName}: HTML Foundations`;
            eraIntroDesc = `Observe how HTML structured web content in ${eraName}.`;
            break;
        case 'css':
            conceptTitle = "CSS Styling";
            eraIntro = `${eraName}: Styling Techniques`;
            eraIntroDesc = `See the evolution of CSS for visual presentation in ${eraName}.`;
            break;
        case 'js':
            conceptTitle = "JavaScript Interactivity";
            eraIntro = `${eraName}: Dynamic Web Logic`;
            eraIntroDesc = `Explore how JavaScript added interactivity to web pages in ${eraName}.`;
            break;
    }
    mainConceptTitle.textContent = conceptTitle;
    eraIntroTitle.textContent = eraIntro;
    eraIntroText.textContent = eraIntroDesc;
    
    // Update "Why This Changed" section
    whyChangedTitle.textContent = conceptTitle;
    whyChangedContent.innerHTML = whyChangedData.content.map(p => `<p>${p}</p>`).join('');

    // Process code for tooltips BEFORE highlighting
    htmlCodeDisplay.innerHTML = processCodeForDisplay(example.html, 'html');
    cssCodeDisplay.innerHTML = processCodeForDisplay(example.css, 'css');
    jsCodeDisplay.innerHTML = processCodeForDisplay(example.js, 'js');

    // --- Apply Syntax Highlighting ---
    hljs.highlightElement(htmlCodeDisplay);
    hljs.highlightElement(cssCodeDisplay);
    hljs.highlightElement(jsCodeDisplay);
    
    // --- Live Preview ---
    livePreviewWrapper.innerHTML = ''; // Clear previous preview
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.backgroundColor = 'transparent'; 
    livePreviewWrapper.appendChild(iframe);

    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { margin: 10px; font-family: sans-serif; background-color: white; color: #333; }
                /* Some basic styles for the iframe content to make it readable */
                h1,h2,h3 { margin-top: 1em; margin-bottom: 0.5em; }
                p { margin-bottom: 1em; }
                a { color: blue; text-decoration: underline; }
                button { padding: 8px 12px; background-color: #f0f0f0; border: 1px solid #ccc; border-radius: 4px; cursor: pointer; }
                /* Inject era-specific CSS */
                ${example.css}
            </style>
        </head>
        <body>
            ${example.html.replace(/DATA-TIP="[^"]*"/g, '')} <!-- Remove DATA-TIP from iframe HTML -->
            <script>
                ${example.js}
            </script>
        </body>
        </html>
    `);
    iframeDoc.close();

    showCodeTab(key + '-code');
}

function showCodeTab(tabId) {
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    const activeButton = document.querySelector(`.tab-button[onclick*="${tabId}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
    const activeContent = document.getElementById(tabId);
    if (activeContent) {
        activeContent.classList.add('active');
    }
}

// --- Dark Mode ---
function toggleDarkMode() {
    isDarkMode =!isDarkMode;
    document.body.classList.toggle('dark-mode', isDarkMode);
    localStorage.setItem('darkMode', isDarkMode);
    darkModeToggle.textContent = isDarkMode? '☀️' : '🌙';
}

// --- Keyboard Navigation ---
function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        if (document.activeElement === slider) {
            if (e.key === 'ArrowLeft' && slider.value > slider.min) {
                slider.value--;
                updateEra(parseInt(slider.value));
            } else if (e.key === 'ArrowRight' && slider.value < slider.max) {
                slider.value++;
                updateEra(parseInt(slider.value));
            }
        } else if (e.key === 'Tab') {
            // Basic tab navigation for buttons/links already works
        }
    });
}

/* ---------------- EVENT LISTENERS ---------------- */
slider.addEventListener("input", () => {
    updateEra(parseInt(slider.value));
});

darkModeToggle.addEventListener('click', toggleDarkMode);

/* ---------------- INITIALIZATION ---------------- */
document.addEventListener('DOMContentLoaded', () => {
    // Apply dark mode immediately on load
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        darkModeToggle.textContent = '☀️';
    } else {
        darkModeToggle.textContent = '🌙';
    }

    setPreview(currentPreviewType);
    slider.value = currentEraIndex;
    updateEra(currentEraIndex);
    setupKeyboardNavigation();
});
