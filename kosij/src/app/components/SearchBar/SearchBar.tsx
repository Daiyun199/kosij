"use client";
import React from "react";
import styles from "./SearchBar.module.css";
interface SearchBarProps {
  value: string;

  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <input
      type="text"
      placeholder="Search..."
      value={value}
      onChange={onChange}
      className={styles.searchBar}
    />
  );
};

export default SearchBar;
