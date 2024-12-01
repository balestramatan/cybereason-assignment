import React from 'react';

interface IProps {
    handleSearch: () => void;
    resetSearch: () => void;
    searchNameQuery: React.RefObject<HTMLInputElement>;
    searchTypeQuery: React.RefObject<HTMLInputElement>;
}

const Search = (props: IProps) => {
    const { handleSearch, resetSearch, searchNameQuery, searchTypeQuery } = props;
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
        <button onClick={handleSearch}>Search</button>
        <button onClick={resetSearch}>Reset</button>
      </div>
    )
}

export default Search;