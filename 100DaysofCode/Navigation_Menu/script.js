document.addEventListener('DOMContentLoaded', () => {
    // ========================================================================== //
    // GLOBAL ELEMENTS & CONTROLS //
    // ========================================================================== //

    const appContainer = document.getElementById('app-container');
    const navSelector = document.getElementById('navSelector');
    const themeToggle = document.getElementById('themeToggle');

    // --- Theme Toggle ---
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', document.body.classList.contains('dark-mode')? 'dark' : 'light');
        themeToggle.textContent = document.body.classList.contains('dark-mode')? 'Toggle Light Mode' : 'Toggle Dark Mode';
    });

    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = 'Toggle Light Mode';
    } else {
        themeToggle.textContent = 'Toggle Dark Mode';
    }

    // --- Read More/Less Toggle Function ---
    function setupReadMoreToggles(container) {
        container.querySelectorAll('.read-more-container').forEach(rmContainer => {
            let toggleButton = rmContainer.querySelector('.read-more-toggle');
            const content = rmContainer.querySelector('.read-more-content');

            if (toggleButton && content) {
                // Ensure there's only one event listener even if re-initialized
                const newToggleButton = toggleButton.cloneNode(true);
                toggleButton.parentNode.replaceChild(newToggleButton, toggleButton);
                toggleButton = newToggleButton; // Update reference

                toggleButton.addEventListener('click', () => {
                    content.classList.toggle('expanded');
                    if (content.classList.contains('expanded')) {
                        toggleButton.textContent = 'Read Less';
                    } else {
                        toggleButton.textContent = 'Read More';
                    }
                });
                // Initialize content to be collapsed
                content.classList.remove('expanded');
                toggleButton.textContent = 'Read More';
            }
        });
    }

    // --- Master Layout Switcher ---
    let currentLayoutObserver = null; // Store current active IntersectionObserver for cleanup

    function renderLayout(layoutId) {
        // Disconnect previous observer if any
        if (currentLayoutObserver) {
            currentLayoutObserver.disconnect();
            currentLayoutObserver = null;
        }

        // Clear existing content
        appContainer.innerHTML = '';

        let layoutHTML = '';
        if (layoutId === 'tabbed-layout') {
            layoutHTML = tabbedLayoutHTML;
        } else if (layoutId === 'accordion-layout') {
            layoutHTML = accordionLayoutHTML;
        } else if (layoutId === 'scrollsnap-layout') {
            layoutHTML = scrollSnapLayoutHTML;
        }

        appContainer.innerHTML = layoutHTML;

        // Initialize JS for the newly rendered layout
        if (layoutId === 'tabbed-layout') initTabbedNav();
        else if (layoutId === 'accordion-layout') initAccordionNav();
        else if (layoutId === 'scrollsnap-layout') initScrollSnapNav();
    }

    navSelector.addEventListener('change', (e) => {
        renderLayout(e.target.value);
    });

    // ========================================================================== //
    // HTML TEMPLATES AS JS STRINGS //
    // ========================================================================== //

    // IMPORTANT: Make sure all IDs and class names are unique or correctly scoped
    // by their respective layout wrappers (e.g., '.tabbed-layout-wrapper.tab-links')
    // I've used wrapper classes for scoping to make CSS easier.

    const consoleGenerationsContent = `
        <section id="gen1">
            <h2>First Generation (1972-1977): The Pioneers</h2>
            <ul>
                <li><strong>Magnavox Odyssey (1972):</strong> World's first home video game console. No sound, plastic screen overlays. Proved home gaming market existed.</li>
                <li><strong>Atari Home Pong (1975):</strong> Single-game system, first console hit, built-in paddle controllers.</li>
            </ul>
            <div class="read-more-container">
                <div class="read-more-content">
                    <p>The first generation of video game consoles began in 1972 with the release of the Magnavox Odyssey. These early systems were characterized by simple graphics, often lacking color, and very basic sound capabilities or none at all. Gameplay was typically limited to basic concepts like paddle-and-ball games. The Odyssey notably required plastic overlays on television screens to simulate game environments, as the console itself could only display dots. Atari's Home Pong, released later, popularized the home video game concept, leading to a boom in dedicated consoles that played only one game. This era set the foundation for all future home gaming, proving that there was a viable market for interactive electronic entertainment beyond arcade halls.</p>
                </div>
                <button class="read-more-toggle">Read More</button>
            </div>
        </section>

        <section id="gen2">
            <h2>Second Generation (1976-1983): The Cartridge Revolution</h2>
            <ul>
                <li><strong>Atari 2600 (1977):</strong> First commercially successful cartridge-based console (originally VCS). Over 30 million units sold.</li>
                <li><strong>Intellivision (1979):</strong> Mattel Electronics, known for more advanced graphics than Atari 2600.</li>
                <li><strong>ColecoVision (1982):</strong> Offered arcade-quality graphics and adapters to play Atari 2600 games.</li>
            </ul>
            <div class="read-more-container">
                <div class="read-more-content">
                    <p>The second generation, often called the "early 8-bit era," marked a significant leap with the introduction of microprocessor-based systems capable of using interchangeable ROM cartridges. This meant consumers could buy new games for their existing console, revolutionizing the market. The Atari 2600 (originally the Atari Video Computer System) dominated this era, selling tens of millions of units and bringing arcade classics like Space Invaders and Pac-Man into homes. Competitors like Intellivision and ColecoVision offered slightly more advanced graphics but couldn't match Atari's market penetration. This era also saw the infamous video game crash of 1983, triggered by market oversaturation and a flood of low-quality games, which nearly destroyed the nascent industry.</p>
                </div>
                <button class="read-more-toggle">Read More</button>
            </div>
        </section>

        <section id="gen3">
            <h2>Third Generation (1983-1987): Nintendo's Rise</h2>
            <ul>
                <li><strong>Nintendo Entertainment System (NES) / Famicom (1983/1985):</strong> Revitalized gaming after the 1983 crash. Iconic games like Super Mario Bros. and The Legend of Zelda.</li>
                <li><strong>Sega Master System (1985):</strong> Sega's competitor to the NES, popular in Europe and Brazil.</li>
            </ul>
            <div class="read-more-container">
                <div class="read-more-content">
                    <p>Emerging from the ashes of the 1983 crash, the third generation was largely defined by Nintendo's entry into the Western market. The Nintendo Entertainment System (NES), launched in Japan as the Famicom, single-handedly revitalized the home video game industry. With strict quality control over third-party developers, groundbreaking games like Super Mario Bros., The Legend of Zelda, and Metroid, and innovative accessories like the Zapper light gun, the NES became a global phenomenon. Sega's Master System was a capable competitor but couldn't quite match the NES's popularity in North America and Japan, finding more success in Europe and Brazil. This generation solidified the cartridge format and established Nintendo as a dominant force in gaming.</p>
                </div>
                <button class="read-more-toggle">Read More</button>
            </div>
        </section>

        <section id="gen4">
            <h2>Fourth Generation (1987-1996): The 16-Bit Wars</h2>
            <ul>
                <li><strong>TurboGrafx-16 (1987):</strong> First console marketed as 16-bit in the US, first to offer CD-ROM peripheral.</li>
                <li><strong>Sega Genesis / Mega Drive (1988/1989):</strong> Major success for Sega, known for "Blast Processing" and Sonic the Hedgehog.</li>
                <li><strong>Super Nintendo Entertainment System (SNES) (1990/1991):</strong> Nintendo's response to Genesis, with Mode 7 graphics and titles like Super Mario World.</li>
                <li><strong>Game Boy (1989):</strong> Nintendo's groundbreaking handheld, bundled with Tetris, sold over 118 million units.</li>
            </ul>
            <div class="read-more-container">
                <div class="read-more-content">
                    <p>The fourth generation ignited the intense "16-bit console wars" between Nintendo and Sega. The Sega Genesis (Mega Drive outside North America) launched first, boasting faster processing and a cooler, edgier image, epitomized by its mascot, Sonic the Hedgehog. Nintendo responded with the Super Nintendo Entertainment System (SNES), which offered superior color palettes, Mode 7 graphics for pseudo-3D effects, and a lineup of critically acclaimed titles like Super Mario World, The Legend of Zelda: A Link to the Past, and Super Metroid. This era also saw the meteoric rise of handheld gaming, led by Nintendo's Game Boy, which popularized portable gaming with Tetris and other simple, addictive titles.</p>
                </div>
                <button class="read-more-toggle">Read More</button>
            </div>
        </section>

        <section id="gen5">
            <h2>Fifth Generation (1993-1996): Enter the 3D Dimension</h2>
            <ul>
                <li><strong>Atari Jaguar (1993):</strong> Marketed as the first 64-bit console, struggled with game selection.</li>
                <li><strong>Sony PlayStation (1994/1995):</strong> Sony's entry, focused on 3D graphics and CD-ROMs, became immensely popular.</li>
                <li><strong>Sega Saturn (1994/1995):</strong> Sega's follow-up, overshadowed by PlayStation.</li>
                <li><strong>Nintendo 64 (1996):</strong> Last major cartridge-based system, introduced analog stick, home to Super Mario 64.</li>
            </ul>
            <div class="read-more-container">
                <div class="read-more-content">
                    <p>The fifth generation was all about the transition to 3D graphics and the shift from cartridges to CD-ROMs. Sony made its debut with the PlayStation, which quickly became a dominant force due to its focus on 3D games, a vast library, and the cost-effectiveness of CD manufacturing. Iconic titles like Final Fantasy VII, Metal Gear Solid, and Resident Evil cemented its place. Nintendo, while initially partnering with Sony on a CD-based console, ultimately stuck with cartridges for the Nintendo 64, renowned for its innovative analog stick and genre-defining games like Super Mario 64 and The Legend of Zelda: Ocarina of Time. Sega's Saturn struggled to compete, despite strong arcade ports, primarily due to its complex hardware architecture and lack of third-party support.</p>
                </div>
                <button class="read-more-toggle">Read More</button>
            </div>
        </section>

        <section id="gen6">
            <h2>Sixth Generation (1998-2005): Online Becomes Standard</h2>
            <ul>
                <li><strong>Sega Dreamcast (1998/1999):</strong> First console with built-in modem for online gaming.</li>
                <li><strong>PlayStation 2 (2000):</strong> Best-selling console of all time (155+ million units), featured DVD player.</li>
                <li><strong>Nintendo GameCube (2001):</strong> Focused on first-party titles, used proprietary mini-discs.</li>
                <li><strong>Xbox (2001):</strong> Microsoft's entry, built-in hard drive, Xbox Live, defined console FPS with Halo.</li>
            </ul>
            <div class="read-more-container">
                <div class="read-more-content">
                    <p>The sixth generation introduced online gaming as a core console feature and saw the continued rise of DVD as a game format. Sega's Dreamcast was ahead of its time with a built-in modem, but its early demise left the field open. The PlayStation 2 became the best-selling console of all time, largely due to its backward compatibility and its dual function as a DVD player, making it a home entertainment hub. Microsoft entered the console market with the Xbox, featuring a powerful GPU, a built-in hard drive, and the revolutionary Xbox Live service, which set the standard for online console multiplayer. Nintendo's GameCube, while having a strong lineup of first-party titles, struggled to compete with the PS2's massive install base and multimedia capabilities.</p>
                </div>
                <button class="read-more-toggle">Read More</button>
            </div>
        </section>

        <section id="gen7">
            <h2>Seventh Generation (2005-2012): HD and Motion Controls</h2>
            <ul>
                <li><strong>Xbox 360 (2005):</strong> First HD console, enhanced Xbox Live, achievement system.</li>
                <li><strong>PlayStation 3 (2006):</strong> Featured Blu-ray player, free online gaming via PSN.</li>
                <li><strong>Nintendo Wii (2006):</strong> Revolutionized gaming with motion controls, attracted casual audience.</li>
            </ul>
            <div class="read-more-container">
                <div class="read-more-content">
                    <p>The seventh generation brought high-definition graphics and new input methods to the forefront. Microsoft's Xbox 360 launched first, establishing an early lead with its strong online presence via Xbox Live and a robust library of early HD titles. Sony's PlayStation 3 followed, featuring a powerful Cell processor and a Blu-ray player, positioning itself as a premium multimedia device. However, it was Nintendo's Wii that truly disrupted the market, introducing accessible motion controls that attracted a massive casual audience beyond traditional gamers. Titles like Wii Sports became cultural phenomena, proving that innovation in gameplay could trump raw graphical power. This era also saw the early adoption of digital distribution and downloadable content.</p>
                </div>
                <button class="read-more-toggle">Read More</button>
            </div>
        </section>

        <section id="gen8">
            <h2>Eighth Generation (2012-2020): Services and Subscriptions</h2>
            <ul>
                <li><strong>Nintendo Wii U (2012):</strong> Introduced tablet-like controller, struggled to find market.</li>
                <li><strong>PlayStation 4 (2013):</strong> Focused on games, strong social integration, dominant console.</li>
                <li><strong>Xbox One (2013):</strong> Known for Xbox Game Pass and backward compatibility.</li>
                <li><strong>Nintendo Switch (2017):</strong> Hybrid console (home and portable), massive success.</li>
            </ul>
            <div class="read-more-container">
                <div class="read-more-content">
                    <p>The eighth generation emphasized online services, digital ecosystems, and evolving business models. Nintendo's Wii U struggled to gain traction despite its innovative GamePad controller, leading to a pivot. Sony's PlayStation 4 dominated the market, focusing on a strong gaming library, user-friendly interface, and social features. Microsoft's Xbox One initially faced criticism over DRM policies but later rebounded by focusing on its Game Pass subscription service, offering a vast library of games for a monthly fee, and enhancing backward compatibility. Nintendo's Switch became a breakout success, revolutionizing portable and home gaming with its hybrid design, allowing seamless transitions between TV and handheld play, and introducing unique joy-con controllers.</p>
                </div>
                <button class="read-more-toggle">Read More</button>
            </div>
        </section>

        <section id="gen9">
            <h2>Ninth Generation (2020-Present): 4K, VR, and Beyond</h2>
            <ul>
                <li><strong>PlayStation 5 (2020):</strong> Ultra-fast SSD, 4K gaming, haptic feedback controllers.</li>
                <li><strong>Xbox Series X/S (2020):</strong> Raw power, 4K gaming, deep integration with Xbox Game Pass.</li>
            </ul>
            <div class="read-more-container">
                <div class="read-more-content">
                    <p>The ninth generation pushed boundaries with unprecedented processing power, ultra-fast SSDs, and advanced graphics capable of 4K resolution and ray tracing. Sony's PlayStation 5 delivered immersive experiences with its DualSense controller's haptic feedback and adaptive triggers, alongside a lineup of exclusive titles. Microsoft's Xbox Series X (the more powerful model) and Series S (a more affordable, digital-only option) emphasized raw power, quick resume features, and further integration with the Game Pass ecosystem, positioning themselves as service-driven platforms. Both consoles prioritize faster load times and higher fidelity, continuing the trend towards more realistic and immersive gaming, with growing interest in virtual reality integration and cloud streaming.</p>
                </div>
                <button class="read-more-toggle">Read More</button>
            </div>
        </section>
    `;

    const tabbedLayoutHTML = `
        <div class="tabbed-layout-wrapper">
            <div class="header-banner">
                <h1>Gaming Console Evolution</h1>
                <p>A journey through generations (Tabbed View)</p>
            </div>

            <nav id="tabNav">
                <ul class="tab-links">
                    <li><a href="#gen1" class="active">1st Gen</a></li>
                    <li><a href="#gen2">2nd Gen</a></li>
                    <li><a href="#gen3">3rd Gen</a></li>
                    <li><a href="#gen4">4th Gen</a></li>
                    <li><a href="#gen5">5th Gen</a></li>
                    <li><a href="#gen6">6th Gen</a></li>
                    <li class="dropdown">
                        <a href="#" class="dropdown-toggle">Modern Era <span class="arrow-down"></span></a>
                        <ul class="dropdown-menu">
                            <li><a href="#gen7">7th Gen</a></li>
                            <li><a href="#gen8">8th Gen</a></li>
                            <li><a href="#gen9">9th Gen</a></li>
                        </ul>
                    </li>
                </ul>
            </nav>

            <div class="tab-content-container">
                ${consoleGenerationsContent}
            </div>
        </div>
    `;

    const accordionLayoutHTML = `
        <div class="accordion-layout-wrapper">
            <nav id="accordionNav">
                <div class="nav-brand">Gaming Eras (Accordion View)</div>
                <button class="menu-toggle">☰ Menu</button>
                <div class="accordion-menu">
                    <div class="accordion-group">
                        <button class="accordion-header active">Early Consoles (1970s-80s) <span class="arrow-indicator"></span></button>
                        <ul class="accordion-body active">
                            <li><a href="#gen1">1st Gen (1972-77)</a></li>
                            <li><a href="#gen2">2nd Gen (1976-83)</a></li>
                            <li><a href="#gen3">3rd Gen (1983-87)</a></li>
                        </ul>
                    </div>
                    <div class="accordion-group">
                        <button class="accordion-header">The 16-Bit & 3D Revolution (1980s-90s) <span class="arrow-indicator"></span></button>
                        <ul class="accordion-body">
                            <li><a href="#gen4">4th Gen (1987-96)</a></li>
                            <li><a href="#gen5">5th Gen (1993-96)</a></li>
                        </ul>
                    </div>
                    <div class="accordion-group">
                        <button class="accordion-header">Online & Multimedia Era (2000s) <span class="arrow-indicator"></span></button>
                        <ul class="accordion-body">
                            <li><a href="#gen6">6th Gen (1998-05)</a></li>
                            <li><a href="#gen7">7th Gen (2005-12)</a></li>
                        </ul>
                    </div>
                    <div class="accordion-group">
                        <button class="accordion-header">Modern & Beyond (2010s-Present) <span class="arrow-indicator"></span></button>
                        <ul class="accordion-body">
                            <li><a href="#gen8">8th Gen (2012-20)</a></li>
                            <li><a href="#gen9">9th Gen (2020-Present)</a></li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div class="content-area">
                ${consoleGenerationsContent}
            </div>
        </div>
    `;

    const scrollSnapLayoutHTML = `
        <div class="scrollsnap-layout-wrapper">
            <nav id="dotsNav">
                <div class="nav-brand">Console Timeline (Snap View)</div>
                <ul class="nav-dots">
                    <li><a href="#gen1" class="active" title="First Gen"></a></li>
                    <li><a href="#gen2" title="Second Gen"></a></li>
                    <li><a href="#gen3" title="Third Gen"></a></li>
                    <li><a href="#gen4" title="Fourth Gen"></a></li>
                    <li><a href="#gen5" title="Fifth Gen"></a></li>
                    <li><a href="#gen6" title="Sixth Gen"></a></li>
                    <li><a href="#gen7" title="Seventh Gen"></a></li>
                    <li><a href="#gen8" title="Eighth Gen"></a></li>
                    <li><a href="#gen9" title="Ninth Gen"></a></li>
                </ul>
            </nav>

            <div class="scroll-container">
                ${consoleGenerationsContent}
            </div>
        </div>
    `;

    // ========================================================================== //
    // TABBED LAYOUT LOGIC //
    // ========================================================================== //
    function initTabbedNav() {
        console.log("Initializing Tabbed Nav");
        const tabbedLayout = appContainer.querySelector('.tabbed-layout-wrapper');
        if (!tabbedLayout) return;

        const tabLinks = tabbedLayout.querySelectorAll('.tab-links > li > a:not(.dropdown-toggle)');
        const dropdownToggles = tabbedLayout.querySelectorAll('.dropdown-toggle');
        const tabPanes = tabbedLayout.querySelectorAll('.tab-pane');
        const dropdownMenus = tabbedLayout.querySelectorAll('.dropdown-menu');

        setupReadMoreToggles(tabbedLayout);

        // --- Tab Click Handler ---
        function tabClickHandler(e) {
            e.preventDefault();
            // Remove active from all links and panes
            tabLinks.forEach(item => item.classList.remove('active'));
            dropdownToggles.forEach(item => item.classList.remove('active'));
            tabbedLayout.querySelectorAll('.dropdown-menu a').forEach(item => item.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            dropdownMenus.forEach(menu => menu.classList.remove('active')); // Hide all dropdowns

            // Add active to the clicked link
            this.classList.add('active');

            // If a dropdown item was clicked, activate its parent dropdown toggle
            const parentDropdown = this.closest('.dropdown');
            if (parentDropdown) {
                parentDropdown.querySelector('.dropdown-toggle').classList.add('active');
            }

            // Get target pane ID and activate it
            const targetId = this.getAttribute('href');
            if (targetId && targetId!== '#') {
                tabbedLayout.querySelector(targetId).classList.add('active');
            }
        }

        // Clean up previous listeners and attach new ones
        tabLinks.forEach(link => {
            link.removeEventListener('click', tabClickHandler);
            link.addEventListener('click', tabClickHandler);
        });

        // --- Dropdown Toggle Handler ---
        function dropdownToggleHandler(e) {
            e.preventDefault();
            e.stopPropagation(); // Prevent document click from immediately closing

            const parentDropdown = this.closest('.dropdown');
            const dropdownMenu = parentDropdown? parentDropdown.querySelector('.dropdown-menu') : null;

            if (dropdownMenu) {
                // Close other dropdowns
                dropdownMenus.forEach(menu => {
                    if (menu!== dropdownMenu) {
                        menu.classList.remove('active');
                        menu.previousElementSibling.classList.remove('active'); // Remove active from toggle button
                    }
                });

                // Toggle current dropdown
                dropdownMenu.classList.toggle('active');
                this.classList.toggle('active');
            }
        }

        dropdownToggles.forEach(toggle => {
            toggle.removeEventListener('click', dropdownToggleHandler);
            toggle.addEventListener('click', dropdownToggleHandler);
        });

        // Close dropdown if clicking outside the dropdown area
        document.removeEventListener('click', tabbedDropdownOutsideClickHandler); // Clean previous
        document.addEventListener('click', tabbedDropdownOutsideClickHandler);

        function tabbedDropdownOutsideClickHandler(e) {
            dropdownMenus.forEach(menu => {
                const parentDropdown = menu.closest('.dropdown');
                if (parentDropdown &&!parentDropdown.contains(e.target)) {
                    menu.classList.remove('active');
                    menu.previousElementSibling.classList.remove('active');
                }
            });
        }

        // Ensure first tab is active on initialization
        if (tabLinks.length > 0 && tabPanes.length > 0) {
            tabLinks.forEach(link => link.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            tabLinks[0].classList.add('active');
            tabPanes[0].classList.add('active');
        }
    }

    // ========================================================================== //
    // ACCORDION LAYOUT LOGIC //
    // ========================================================================== //
    function initAccordionNav() {
        console.log("Initializing Accordion Nav");
        const accordionLayout = appContainer.querySelector('.accordion-layout-wrapper');
        if (!accordionLayout) return;

        const accordionHeaders = accordionLayout.querySelectorAll('.accordion-header');
        const navLinks = accordionLayout.querySelectorAll('.accordion-body li a');
        const sections = accordionLayout.querySelectorAll('.content-area section');
        const menuToggle = accordionLayout.querySelector('.menu-toggle');
        const accordionMenu = accordionLayout.querySelector('.accordion-menu');

        setupReadMoreToggles(accordionLayout);

        // Clean up previous listeners
        accordionHeaders.forEach(header => header.removeEventListener('click', accordionHeaderHandler));
        navLinks.forEach(link => link.removeEventListener('click', accordionLinkHandler));
        if (menuToggle) menuToggle.removeEventListener('click', accordionMenuToggleHandler);

        if (menuToggle) {
            menuToggle.addEventListener('click', accordionMenuToggleHandler);
            accordionMenu.classList.remove('active'); // Close menu on re-init
            menuToggle.textContent = '☰ Menu';
        }

        accordionHeaders.forEach(header => {
            header.addEventListener('click', accordionHeaderHandler);
            // Ensure first group is open by default on init
            // This needs to be done carefully to only open the first one on initial setup
            // Or only if no active class is present
            if (header.classList.contains('active')) {
                 const accordionBody = header.nextElementSibling;
                 if (accordionBody) accordionBody.classList.add('active');
            }
        });

        navLinks.forEach(link => {
            link.addEventListener('click', accordionLinkHandler);
        });

        // Intersection Observer to highlight current section in nav
        const observerOptions = { root: null, rootMargin: '0px', threshold: 0.3 };
        currentLayoutObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    const currentNavLink = accordionLayout.querySelector(`.accordion-body a[href="#${entry.target.id}"]`);
                    if (currentNavLink) {
                        currentNavLink.classList.add('active');
                        // Also ensure its parent accordion group is open
                        const parentAccordionBody = currentNavLink.closest('.accordion-body');
                        if (parentAccordionBody &&!parentAccordionBody.classList.contains('active')) {
                            parentAccordionBody.classList.add('active');
                            parentAccordionBody.previousElementSibling.classList.add('active'); // Activate header
                        }
                    }
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            currentLayoutObserver.observe(section);
        });

        // Handlers for accordion nav
        function accordionMenuToggleHandler() {
            accordionMenu.classList.toggle('active');
            this.textContent = accordionMenu.classList.contains('active')? '✖ Close' : '☰ Menu';
        }

        function accordionHeaderHandler() {
            this.classList.toggle('active');
            const accordionBody = this.nextElementSibling;
            if (accordionBody) {
                if (accordionBody.classList.contains('active')) {
                    accordionBody.classList.remove('active');
                } else {
                    accordionBody.classList.add('active');
                }
            }
        }

        function accordionLinkHandler(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = accordionLayout.querySelector(targetId);
            if (targetElement) {
                const offset = 20;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
                navLinks.forEach(item => item.classList.remove('active'));
                this.classList.add('active');
                if (accordionMenu.classList.contains('active') && window.innerWidth <= 768) {
                    accordionMenu.classList.remove('active');
                    menuToggle.textContent = '☰ Menu';
                }
            }
        }
    }

    // ========================================================================== //
    // SCROLL-SNAP LAYOUT LOGIC //
    // ========================================================================== //
    function initScrollSnapNav() {
        console.log("Initializing Scroll-Snap Nav");
        const scrollsnapLayout = appContainer.querySelector('.scrollsnap-layout-wrapper');
        if (!scrollsnapLayout) return;

        const scrollContainer = scrollsnapLayout.querySelector('.scroll-container');
        const navDots = scrollsnapLayout.querySelectorAll('.nav-dots a');
        const sections = scrollsnapLayout.querySelectorAll('.scroll-snap-section');

        setupReadMoreToggles(scrollsnapLayout);

        // Clean up previous listeners
        if (scrollContainer) scrollContainer.removeEventListener('scroll', updateActiveDotScrollSnap);
        navDots.forEach(dot => dot.removeEventListener('click', scrollSnapDotClickHandler));

        // Reset scroll position on init
        if (scrollContainer) scrollContainer.scrollTop = 0;

        // --- Content Animation Observer ---
        const contentObserverOptions = { root: null, threshold: 0.5 };
        currentLayoutObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const content = entry.target.querySelector('.section-content');
                if (content) {
                    if (entry.isIntersecting) {
                        content.style.opacity = '1';
                        content.style.transform = 'translateY(0)';
                        // Also activate the dot
                        const dot = scrollsnapLayout.querySelector(`.nav-dots a[href="#${entry.target.id}"]`);
                        if (dot) {
                            scrollsnapLayout.querySelectorAll('.nav-dots a').forEach(d => d.classList.remove('active'));
                            dot.classList.add('active');
                        }
                    } else {
                        content.style.opacity = '0';
                        content.style.transform = 'translateY(20px)';
                    }
                }
            });
        }, contentObserverOptions);
        sections.forEach(section => {
            currentLayoutObserver.observe(section);
        });

        // Re-add scroll listener
        if (scrollContainer) scrollContainer.addEventListener('scroll', updateActiveDotScrollSnap);

        // Re-add dot click listeners
        navDots.forEach(dot => {
            dot.addEventListener('click', scrollSnapDotClickHandler);
        });

        // Initial update for dots
        updateActiveDotScrollSnap();

        // Handlers for scroll-snap nav
        function updateActiveDotScrollSnap() {
            let currentActiveSectionId = 'gen1';
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                // If top of section is near the top half of viewport
                if (rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.5) {
                    currentActiveSectionId = section.id;
                }
            });
            navDots.forEach(dot => {
                dot.classList.remove('active');
                if (dot.getAttribute('href') === `#${currentActiveSectionId}`) {
                    dot.classList.add('active');
                }
            });
        }

        function scrollSnapDotClickHandler(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = scrollsnapLayout.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }

    // ========================================================================== //
    // INITIAL LOAD //
    // ========================================================================== //
    // Render the default layout (Tabbed) on page load
    renderLayout(navSelector.value);
});