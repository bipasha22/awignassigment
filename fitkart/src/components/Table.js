import React, { useEffect, useState } from "react";
import axios from "axios";
import TableCell from "@mui/material/TableCell";
import { TableBody, TableContainer, TableHead, TableRow } from "@mui/material";
import Select from "react-select";
import "./Table.css";
export const Table = () => {



  const [tableData, setTableData] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  const [search, setSearch] = useState("");

  const [filteredResults, setFilteredResults] = useState([]);

const[productCount, setProductCount] = useState(10)

const [colorSelectedOptions, setColorSelectedOptions] = useState([]);
const [availabilitySelectedOptions, setAvailabilitySelectedOptions] = useState([]);

let [filteredData, setFilteredData] = useState(tableData);


  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(
          `https://62e6bd340e5d74566aebd18b.mockapi.io/api/v1/products`
        );
        setTableData(response.data.products);
        setFilteredData(response.data.products);
        setError(null);
      } catch (err) {
        setError(err.message);
        setTableData(null);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const searchItems = (searchValue) => {
    setSearch(searchValue);
    // console.log(searchValue);
    if (search !== "") {
      const filteredData = tableData.filter((item) => {
        return Object.values(item)
          .join("")
          .toLowerCase()
          .includes(search.toLowerCase());
      });
      setFilteredResults(filteredData);
    // console.log(filteredData);

    } else {
      setFilteredResults(tableData);
    console.log(tableData);

    }

  };

  const loadMore = () =>{   
    setProductCount(tableData.length)
  }


  const colorOptionList = [
    { value: "brown", label: "Brown" },
    { value: "black", label: "Black" },
    { value: "orange", label: "Orange" },
    { value: "blue", label: "Blue" },
    { value: "white", label: "White" },
    { value: "offwhite", label: "Off White" },
    { value: "red", label: "Red" },
    { value: "rust", label: "Rust" },
    { value: "transparent", label: "Transparent" },
    { value: "gold", label: "Gold" },
  ];

  const availabilityOptionList = [
      {value:"Out of stock", label: "Out of stock"},
      {value:"in stock", label: "in stock"},
  ]

 

  function getFilteredData(colorSelectedOptions,availabilitySelectedOptions){
    console.log(colorSelectedOptions, tableData);
    console.log(availabilitySelectedOptions);

    let tempDataItem = [];
    let tempDataItems = [];

    if(colorSelectedOptions.length === 0){
      tempDataItem = tableData;
    }
    else{
      for(let i =0 ; i<tableData.length; i++){
        for(let j= 0; j<colorSelectedOptions.length;j++ ){
          if(tableData[i].color === colorSelectedOptions[j].label){
            tempDataItem.push(tableData[i]);
            break;
          }
        }
      }
    }
    console.log(tempDataItem);
    if(availabilitySelectedOptions.length === 0){
      tempDataItems = tempDataItem;
    }
    else{
      for(let i =0 ; i<tempDataItem.length; i++){
        for(let j= 0; j<availabilitySelectedOptions.length;j++ ){
          if(tempDataItem[i].availability === availabilitySelectedOptions[j].label){
            tempDataItems.push(tempDataItem[i]);
            break;
          }
        }
      }
    }
    
    setFilteredData(tempDataItems);
  }


  function handleColorSelect(data) {
    setColorSelectedOptions(data);
    getFilteredData(data,availabilitySelectedOptions);
  }
  function handleAvailabilitySelect(data) {
    setAvailabilitySelectedOptions(data);
    getFilteredData(colorSelectedOptions,data);
  }
  return (
    <div>
      <h1>FitKart</h1>
      {loading && <div>A moment please...</div>}
      {error && (
        <div>{`There is a problem fetching the post data - ${error}`}</div>
      )}
      <div className="search-wrapper">
        <label htmlFor="search-form">
          <input
            type="search"
            name="search-form"
            id="search-form"
            className="search-input"
            placeholder="Search products"
            value={search}
            onChange={(e) => searchItems(e.target.value)}
          />
        </label>
      </div>
      <div className="dropdown-container">
      <label> Filter By </label>
      <Select
        options={colorOptionList}
        placeholder="Select color"
        value={colorSelectedOptions}
        onChange={handleColorSelect}
        isSearchable={true}
        isMulti
      />
      <Select
        options={availabilityOptionList}
        placeholder="Select availabilty"
        value={availabilitySelectedOptions}
        onChange={handleAvailabilitySelect}
        isSearchable={true}
        isMulti
      />
      </div>
      <br />
      <TableContainer>
        <TableHead>
            <TableRow >
              <TableCell align="center">ID</TableCell>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Color</TableCell>
              <TableCell align="center">Availability</TableCell>
            </TableRow>
          </TableHead>
        {search.length > 3 ? (filteredResults.map(item=>{
          
          return(
          
          <TableBody style={{width: "100%"}}>
           
                <TableRow key={item.id}>
                  <TableCell align="center">{item.id}</TableCell>
                  <TableCell align="center">{item.name}</TableCell>
                  <TableCell align="center">{item.color}</TableCell>
                  <TableCell align="center">{item.availability}</TableCell>
                </TableRow>
          </TableBody>
          )
        })
        ):(
          
         <TableBody style={{width: "100%"}}>

            {filteredData && filteredData.slice(0, productCount).map(({ id, name, color, availability }) => (
              <TableRow key={id}>
                <TableCell align="center">{id}</TableCell>
                <TableCell align="center">{name}</TableCell>
                <TableCell align="center">{color}</TableCell>
                <TableCell align="center">{availability}</TableCell>
              </TableRow>
            ))}
        </TableBody>
        )
            }
      </TableContainer>

      {/* ))} */}
      {<button onClick={loadMore} className="showButton"> Load More </button>}

    </div>
  );
};
