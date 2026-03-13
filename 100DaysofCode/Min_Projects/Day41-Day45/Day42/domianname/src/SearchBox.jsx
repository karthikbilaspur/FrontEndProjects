import React from 'react';
import PropTypes from 'prop-types';

const SearchBox = ({ onInputChange }) => {
  const handleChange = (event) => {
    onInputChange(event.target.value);
  };

  return (
    <div className="search-container">
      <input
        onChange={handleChange}
        placeholder="Type keywords"
        className="search-input"
      />
    </div>
  );
};

SearchBox.propTypes = {
  onInputChange: PropTypes.func.isRequired,
};

export default SearchBox;