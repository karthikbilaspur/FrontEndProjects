    // src/components/AboutUs.jsx
    import React from 'react';
    import { useInView } from 'react-intersection-observer';
    import './AboutUs.css'; // We'll create this CSS file next

    function AboutUs() {
      const { ref: textRef, inView: textInView } = useInView({
        triggerOnce: true, // Only trigger once when it enters the viewport
        threshold: 0.1, // Trigger when 10% of the element is visible
      });

      const { ref: imageRef, inView: imageInView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
        delay: 200, // Add a slight delay for the image to animate after the text
      });

      return (
        <div className="about-us-container">
          <div ref={textRef} className={`about-content ${textInView? 'is-visible' : ''}`}>
            <h2>Our Culinary Journey</h2>
            <p>
              Nestled in the heart of the city, Our Restaurant began with a simple passion: to bring authentic,
              heartfelt cuisine to our community. Founded in 20XX by Chef [Chef's Name], our establishment is a testament
              to the timeless art of cooking, blending traditional techniques with contemporary flavors.
            </p>
            <p>
              Every dish tells a story, crafted with the freshest locally-sourced ingredients and a sprinkle of innovation.
              We believe dining is more than just eating; it's an experience to be savored, shared, and remembered.
              Come, be a part of our story, and let us serve you a taste of passion.
            </p>
          </div>
          <div ref={imageRef} className={`about-image-wrapper ${imageInView? 'is-visible' : ''}`}>
            <img
              src="https://via.placeholder.com/500/8B4513/FFFFFF?text=Chef+Story" // Placeholder image for story
              alt="Our Chef's Story"
              className="about-image"
            />
          </div>
        </div>
      );
    }

    export default AboutUs;