import React from 'react';
import PropTypes from 'prop-types';

const Header = ({ headTitle }) => {
  return (
    <div className="head-container">
      <h1 className="head-text">{headTitle}</h1>
    </div>
  );
};

Header.propTypes = {
  headTitle: PropTypes.string.isRequired,
};

export default Header;