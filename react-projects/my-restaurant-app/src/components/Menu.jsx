    // src/components/Menu.jsx
    import React, { useState } from 'react';
    import './Menu.css'; // We'll create this CSS file next

    // Mock data for our menu
    const menuItems = [
      {
        id: 1,
        name: 'Classic Margherita Pizza',
        category: 'Pizza',
        price: 14.00,
        description: 'Tomato sauce, fresh mozzarella, basil, and a drizzle of olive oil.',
        allergens: ['Gluten', 'Dairy'],
        image: 'https://via.placeholder.com/150/FF6347/FFFFFF?text=Pizza' // Placeholder image
      },
      {
        id: 2,
        name: 'Spaghetti Carbonara',
        category: 'Pasta',
        price: 18.50,
        description: 'Traditional Roman pasta with eggs, hard cheese, cured pork, and black pepper.',
        allergens: ['Gluten', 'Dairy', 'Eggs', 'Pork'],
        image: 'https://via.placeholder.com/150/FFD700/000000?text=Pasta'
      },
      {
        id: 3,
        name: 'Caesar Salad',
        category: 'Salad',
        price: 12.00,
        description: 'Crisp romaine lettuce, croutons, parmesan cheese, and creamy Caesar dressing.',
        allergens: ['Gluten', 'Dairy', 'Eggs', 'Fish'],
        image: 'https://via.placeholder.com/150/32CD32/FFFFFF?text=Salad'
      },
      {
        id: 4,
        name: 'Beef Lasagna',
        category: 'Pasta',
        price: 19.00,
        description: 'Layers of pasta, rich beef ragu, béchamel sauce, and parmesan cheese.',
        allergens: ['Gluten', 'Dairy', 'Beef'],
        image: 'https://via.placeholder.com/150/8B4513/FFFFFF?text=Lasagna'
      },
      {
        id: 5,
        name: 'Tiramisu',
        category: 'Dessert',
        price: 9.00,
        description: 'Coffee-soaked ladyfingers, mascarpone cheese, and cocoa powder.',
        allergens: ['Gluten', 'Dairy', 'Eggs', 'Coffee'],
        image: 'https://via.placeholder.com/150/D2B48C/000000?text=Tiramisu'
      },
      {
        id: 6,
        name: 'Sparkling Water',
        category: 'Beverage',
        price: 4.00,
        description: 'Refreshing carbonated mineral water.',
        allergens: [],
        image: 'https://via.placeholder.com/150/B0E0E6/000000?text=Water'
      },
      {
        id: 7,
        name: 'Mushroom Risotto',
        category: 'Main Course', // Added a generic 'Main Course' category as an example
        price: 21.00,
        description: 'Creamy Arborio rice with assorted wild mushrooms and parmesan.',
        allergens: ['Dairy'],
        image: 'https://via.placeholder.com/150/A9A9A9/FFFFFF?text=Risotto'
      },
      {
        id: 8,
        name: 'Chocolate Lava Cake',
        category: 'Dessert',
        price: 10.50,
        description: 'Warm chocolate cake with a molten center, served with vanilla ice cream.',
        allergens: ['Gluten', 'Dairy', 'Eggs'],
        image: 'https://via.placeholder.com/150/8B0000/FFFFFF?text=LavaCake'
      },
    ];

    function Menu() {
      const [activeCategory, setActiveCategory] = useState('All');
      const [searchTerm, setSearchTerm] = useState('');

      // Get unique categories for our filter buttons
      const categories = ['All', ...new Set(menuItems.map(item => item.category))];

      // Filtered items based on activeCategory and searchTerm
      const filteredItems = menuItems.filter(item => {
        const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              item.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
      });

      return (
        <div className="menu-container">
          <div className="menu-filters">
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {categories.map(category => (
              <button
                key={category}
                onClick={() => {
                  setActiveCategory(category);
                  setSearchTerm(''); // Clear search when changing category
                }}
                className={activeCategory === category ? 'active' : ''}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="menu-list">
            {filteredItems.length > 0 ? (
              filteredItems.map(item => (
                <div key={item.id} className="menu-item">
                  <img src={item.image} alt={item.name} className="menu-item-image" />
                  <div className="item-details">
                    <h3>{item.name} - ${item.price.toFixed(2)}</h3>
                    <p>{item.description}</p>
                    {item.allergens.length > 0 && (
                      <p className="allergens">Allergens: {item.allergens.join(', ')}</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>No items found for this selection.</p>
            )}
          </div>
        </div>
      );
    }

    export default Menu;