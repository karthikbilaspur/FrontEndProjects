    // src/components/Gallery.jsx
    import React, { useState } from 'react';
    import Lightbox from 'react-image-lightbox';
    import './Gallery.css'; // We'll create this CSS file next

    // Mock image data
    const images = [
      { src: 'https://via.placeholder.com/600/FF6347/FFFFFF?text=Dish+1', alt: 'Delicious Pasta Dish' },
      { src: 'https://via.placeholder.com/600/FFD700/000000?text=Restaurant+Interior', alt: 'Cozy Restaurant Interior' },
      { src: 'https://via.placeholder.com/600/32CD32/FFFFFF?text=Chef+at+Work', alt: 'Chef Preparing Food' },
      { src: 'https://via.placeholder.com/600/8B4513/FFFFFF?text=Signature+Cocktail', alt: 'Signature Cocktail' },
      { src: 'https://via.placeholder.com/600/D2B48C/000000?text=Outdoor+Seating', alt: 'Beautiful Outdoor Seating' },
      { src: 'https://via.placeholder.com/600/B0E0E6/000000?text=Dessert+Platter', alt: 'Dessert Platter' },
    ];

    function Gallery() {
      const [isOpen, setIsOpen] = useState(false);
      const [photoIndex, setPhotoIndex] = useState(0);

      const openLightbox = (index) => {
        setPhotoIndex(index);
        setIsOpen(true);
      };

      return (
        <div className="gallery-container">
          <div className="image-grid">
            {images.map((image, index) => (
              <div key={index} className="gallery-item" onClick={() => openLightbox(index)}>
                <img src={image.src} alt={image.alt} />
                <div className="overlay">
                  <span>View</span>
                </div>
              </div>
            ))}
          </div>

          {isOpen && (
            <Lightbox
              mainSrc={images[photoIndex].src}
              nextSrc={images[(photoIndex + 1) % images.length].src}
              prevSrc={images[(photoIndex + images.length - 1) % images.length].src}
              onCloseRequest={() => setIsOpen(false)}
              onMovePrevRequest={() =>
                setPhotoIndex((photoIndex + images.length - 1) % images.length)
              }
              onMoveNextRequest={() =>
                setPhotoIndex((photoIndex + 1) % images.length)
              }
              imageTitle={images[photoIndex].alt}
              imagePadding={100} // Adjust padding as needed
            />
          )}
        </div>
      );
    }

    export default Gallery;