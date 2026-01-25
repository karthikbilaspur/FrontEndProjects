import React, { useState } from 'react';
import Header from './Header';
import ResultContainer from './ResultContainer';
import SearchBox from './SearchBox';
import name from '@rstacruz/startup-name-generator';
import './App.css';

function App() {
  const [headerText] = useState("Just Name It!!");
  const [headerExpanded, setHeaderExpanded] = useState(true);
  const [suggestedNames, setSuggestedNames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = async (inputText) => {
    setIsLoading(true);
    setHeaderExpanded(!(inputText.length > 0));
    const names = (inputText.length > 0) ? name(inputText) : [];
    setSuggestedNames(names);
    setIsLoading(false);
  };

  return (
    <div>
      <Header headTitle={headerText} headerExpanded={headerExpanded} />
      <SearchBox onInputChange={handleInputChange} />
      {isLoading ? <p>Loading...</p> : <ResultContainer suggestedNames={suggestedNames} />}
    </div>
  );
}

export default App;