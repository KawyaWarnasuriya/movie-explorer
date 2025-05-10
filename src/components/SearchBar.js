import React from 'react';

const SearchBar = ({ searchTerm, onSearch }) => {
  return (
    <div style={{ marginBottom: '1rem', textAlign: 'right' }}>
      <input
        type="text"
        placeholder="Search for a movie..."
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        style={{
          padding: '0.5rem',
          alignItem: 'right',
          width: '200px',
          fontSize: '16px',
          borderRadius: '5px',
          border: '1px solid #964B00',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      />
    </div>
  );
};

export default SearchBar;
