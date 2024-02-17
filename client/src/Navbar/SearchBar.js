import { Button, Input } from "antd";
import { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [searchText, setSearchText] = useState("");

  const handleSearch = () => {
    onSearch(searchText);
  }

  const searchInput = {
    placeholder: "ค้นหาสถานที่ท่องเที่ยว หรือโปรแกรมทัวร์",
    color: "black",
    width: "30%",
    height: "40px",
    fontWeight: "bold",
    justifyContent: "center",
  };

  return (
    <>
      <Input
        style={searchInput}
        placeholder={searchInput.placeholder}
        onChange={(e) => setSearchText(e.target.value)}
        onPressEnter={() => onSearch(searchText)}
      />
      <Button
        type="primary"
        style={{ height: "40px" }}
        onClick={() => handleSearch()}
      >ค้นหา
      </Button>
    </>
  );
};

export default SearchBar;