import React, { useState } from 'react';

function Autocomplete({ suggestions, onSelected }) {
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [userInput, setUserInput] = useState('');

  const onChange = (e) => {
    const userInput = e.currentTarget.value;
    setUserInput(userInput);
    if (userInput.length > 1) {
      const filteredSuggestions = suggestions.filter(
        suggestion => suggestion.name.toLowerCase().indexOf(userInput.toLowerCase()) > -1
      );
      setFilteredSuggestions(filteredSuggestions);
    } else {
      setFilteredSuggestions([]);
    }
  };

  const onClick = (suggestion) => {
    onSelected(suggestion);
    setUserInput(suggestion.name);
    setFilteredSuggestions([]);
  };

  return (
    <div>
      <input
        type="text"
        onChange={onChange}
        value={userInput}
        placeholder="Start typing park name..."
      />
      {filteredSuggestions.length > 0 && (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {filteredSuggestions.map((suggestion) => (
            <li key={suggestion.id} onClick={() => onClick(suggestion)}>
              {suggestion.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Autocomplete;
