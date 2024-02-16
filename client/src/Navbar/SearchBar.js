import { Button, Input } from "antd";

const SearchBar = ({ placeholder, onSearch }) => {
  const searchInput = {
    placeholder: "ค้นหาสถานที่ท่องเที่ยว หรือโปรแกรมทัวร์",
    color: "black",
    width: "30%",
    height: "40px",
    fontWeight: "bold",
    justifyContent: "center",
  };

  return (
    <Input
      style={searchInput}
      placeholder={searchInput.placeholder}
      onSearch={onSearch}
    />
  );

};

export default SearchBar;
