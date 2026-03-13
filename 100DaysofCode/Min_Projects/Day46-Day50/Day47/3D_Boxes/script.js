class FlipBox {
    constructor(element) {
        this.element = element;
        this.trigger = element.dataset.flipTrigger;
        this.direction = element.dataset.flipDirection;

        this.init();
    }

    init() {
        if (this.trigger === 'hover') {
            this.element.addEventListener('mouseover', () => {
                this.element.classList.add('hover');
            });

            this.element.addEventListener('mouseout', () => {
                this.element.classList.remove('hover');
            });
        } else if (this.trigger === 'click') {
            this.element.addEventListener('click', () => {
                this.element.classList.toggle('hover');
            });
        }

        // Add animation on load
        this.element.classList.add('animated');
        setTimeout(() => {
            this.element.classList.remove('animated');
        }, 1000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const flipBoxes = document.querySelectorAll('.flip-box');

    flipBoxes.forEach((box) => {
        new FlipBox(box);
    });

    // Add smooth scrolling to anchors
    const anchors = document.querySelectorAll('a[href^="#"]');

    anchors.forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = anchor.getAttribute('href');
            const element = document.querySelector(target);

            element.scrollIntoView({
                behavior: 'smooth',
            });
        });
    });
});