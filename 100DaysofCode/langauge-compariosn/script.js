const languages = [
    {
        name: 'JavaScript',
        description: 'A high-level, dynamic language for web development.',
        helloWorld: 'console.log("Hello, World!");',
        strength: 'Fast and flexible, ideal for web development.',
        weakness: 'Can be slow for complex computations.',
        framework: 'React, Angular, Vue.js',
        library: 'jQuery, Lodash',
        features: [
            { name: 'Type', value: 'Dynamic' },
            { name: 'Paradigm', value: 'Multi-paradigm' },
            { name: 'Platform', value: 'Web, Node.js' }
        ]
    },
    {
        name: 'Python',
        description: 'A high-level, interpreted language for various applications.',
        helloWorld: 'print("Hello, World!")',
        strength: 'Easy to learn, versatile, and widely used.',
        weakness: 'Slow for complex computations.',
        framework: 'Django, Flask',
        library: 'NumPy, Pandas',
        features: [
            { name: 'Type', value: 'Dynamic' },
            { name: 'Paradigm', value: 'Multi-paradigm' },
            { name: 'Platform', value: 'Cross-platform' }
        ]
    },
    {
        name: 'Java',
        description: 'An object-oriented language for Android app development and more.',
        helloWorld: 'System.out.println("Hello, World!");',
        strength: 'Platform-independent, robust, and widely used.',
        weakness: 'Verbose syntax.',
        framework: 'Spring, Hibernate',
        library: 'Apache Commons, Guava',
        features: [
            { name: 'Type', value: 'Static' },
            { name: 'Paradigm', value: 'Object-oriented' },
            { name: 'Platform', value: 'Cross-platform' }
        ]
    },
    {
        name: 'C++',
        description: 'A high-performance, compiled language for systems programming.',
        helloWorld: 'std::cout << "Hello, World!" << std::endl;',
        strength: 'Fast, efficient, and control over hardware resources.',
        weakness: 'Steep learning curve, error-prone.',
        framework: 'Qt, Boost',
        library: 'STL, Boost',
        features: [
            { name: 'Type', value: 'Static' },
            { name: 'Paradigm', value: 'Object-oriented' },
            { name: 'Platform', value: 'Cross-platform' }
        ]
    },
    {
        name: 'Ruby',
        description: 'A dynamic, object-oriented language for web development.',
        helloWorld: 'puts "Hello, World!"',
        strength: 'Easy to learn, flexible, and productive.',
        weakness: 'Slow performance.',
        framework: 'Ruby on Rails',
        library: 'RubyGems',
        features: [
            { name: 'Type', value: 'Dynamic' },
            { name: 'Paradigm', value: 'Object-oriented' },
            { name: 'Platform', value: 'Cross-platform' }
        ]
    },
    {
        name: 'Go',
        description: 'A statically typed, compiled language for concurrent programming.',
        helloWorld: 'fmt.Println("Hello, World!")',
        strength: 'Fast, efficient, and concurrent.',
        weakness: 'Limited libraries and frameworks.',
        framework: 'Revel, Gin',
        library: 'Golang standard library',
        features: [
            { name: 'Type', value: 'Static' },
            { name: 'Paradigm', value: 'Concurrent' },
            { name: 'Platform', value: 'Cross-platform' }
        ]
    },
    {
        name: 'Swift',
        description: 'A modern, high-performance language for iOS and macOS development.',
        helloWorld: 'print("Hello, World!")',
        strength: 'Fast, safe, and modern syntax.',
        weakness: 'Limited cross-platform support.',
        framework: 'SwiftUI, UIKit',
        library: 'Swift Standard Library',
        features: [
            { name: 'Type', value: 'Static' },
            { name: 'Paradigm', value: 'Object-oriented' },
            { name: 'Platform', value: 'iOS, macOS, watchOS, tvOS' }
        ]
    },
    {
        name: 'Rust',
        description: 'A systems programming language focused on safety and performance.',
        helloWorld: 'fn main() { println!("Hello, World!"); }',
        strength: 'Memory safety, performance, and concurrency.',
        weakness: 'Steep learning curve.',
        framework: 'Rocket, Actix-web',
        library: 'Cargo, Rust Standard Library',
        features: [
            { name: 'Type', value: 'Static' },
            { name: 'Paradigm', value: 'Multi-paradigm' },
            { name: 'Platform', value: 'Cross-platform' }
        ]
    },
    {
        name: 'Kotlin',
        description: 'A modern, concise language for Android app development.',
        helloWorld: 'fun main() { println("Hello, World!") }',
        strength: 'Concise, safe, and interoperable with Java.',
        weakness: 'Limited resources compared to Java.',
        framework: 'Kotlinx, AndroidX',
        library: 'Kotlin Standard Library',
        features: [
            { name: 'Type', value: 'Static' },
            { name: 'Paradigm', value: 'Object-oriented' },
            { name: 'Platform', value: 'Android, JVM, Native' }
        ]
    }
];

// Generate accordion items
const accordion = document.getElementById('languageAccordion');
languages.forEach((language, index) => {
    const accordionItem = document.createElement('div');
    accordionItem.className = 'accordion-item';

    const headerId = `heading-${index}`;
    const collapseId = `collapse-${index}`;

    accordionItem.innerHTML = `
        <h2 class="accordion-header" id="${headerId}">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-expanded="false" aria-controls="${collapseId}">
                ${language.name}
            </button>
        </h2>
        <div id="${collapseId}" class="accordion-collapse collapse" aria-labelledby="${headerId}" data-bs-parent="#languageAccordion">
            <div class="accordion-body">
                <p>${language.description}</p>
                <h5>Hello World:</h5>
                <pre class="code-snippet">${language.helloWorld}</pre>
                <h5>Strength:</h5>
                <p>${language.strength}</p>
                <h5>Weakness:</h5>
                <p>${language.weakness}</p>
                <h5>Framework:</h5>
                <p>${language.framework}</p>
                <h5>Library:</h5>
                <p>${language.library}</p>
                <h5>Features:</h5>
                <ul>
                    ${language.features.map(feature => `<li><strong>${feature.name}:</strong> ${feature.value}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;

    accordion.appendChild(accordionItem);
});

document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('.quick-links a');
    links.forEach(link => {
        link.addEventListener('click', function() {
            links.forEach(l => {
                const contentId = l.getAttribute('data-bs-target');
                const content = document.querySelector(contentId);
                if (content) {
                    content.classList.remove('show');
                }
            });
            const contentId = link.getAttribute('data-bs-target');
            const content = document.querySelector(contentId);
            if (content) {
                content.classList.add('show');
            }
        });
    });
    links[0].click();
});