import { Button, Input } from "antd";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";

const SearchBar = ({ onSearch }) => {
  const [searchText, setSearchText] = useState("");
  const isSmallScreen = useMediaQuery({ maxWidth: 768 });

  const handleSearch = () => {
    onSearch(searchText);
  }

  const searchInput = {
    placeholder: "ค้นหาสถานที่ท่องเที่ยว หรือโปรแกรมทัวร์",
    color: "black",
    width: isSmallScreen? "75%":"30%",
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