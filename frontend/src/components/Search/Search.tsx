import React from 'react';

interface IProps {
    handleSearch: () => void;
    searchNameQuery: React.RefObject<HTMLInputElement>;
    searchTypeQuery: React.RefObject<HTMLInputElement>;
}

const Search = React.memo((props: IProps) => { // React.memo is used to prevent unnecessary re-renders
    const { handleSearch, searchNameQuery, searchTypeQuery } = props;
    return (
        <div className="search-container">
        <input
          ref={searchNameQuery}
          type="text"
          placeholder="Search by name"
        />
        <input
          ref={searchTypeQuery}
          type="text"
          placeholder="Search by type"
        />
        <button onClick={handleSearch}>🔍</button>
      </div>
    )
});

export default Search;