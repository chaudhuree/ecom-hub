import { Button, Col, Input, Row } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ItemList from "../components/ItemList";
import DefaultLayout from "./../components/DefaultLayout";
const Homepage = () => {
  const [itemsData, setItemsData] = useState([]);
  const [selecedCategory, setSelecedCategory] = useState(null);

  const dispatch = useDispatch();
  //set token to header

  const navigate = useNavigate();
  //useEffect for get all items
  useEffect(() => {
    const getAllItems = async () => {
      try {
        dispatch({
          type: "SHOW_LOADING",
        });
        const { data } = await axios.get("/get-item");
        setItemsData(data);
        dispatch({ type: "HIDE_LOADING" });
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    getAllItems();
  }, [dispatch]);

  //search query parameters
  const queryParams = new URLSearchParams(window.location.search);
  const myQueryParam = queryParams.get("category");
  useEffect(() => {
    setSelecedCategory(myQueryParam);
  }, [myQueryParam]);

  //filter data
  // fontend filter
  const handleFiter = (e) => {
    
      const data = document
      .querySelectorAll("h6.product-name")
      .forEach((item) => {
        item.innerText.toLowerCase().includes(e.target?.value?.toLowerCase())
          ? (item.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.style.display =
              "")
          : (item.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.style.display =
              "none");
      });
    
  };

  return (
    <DefaultLayout>
      {/*
      filter: function starts
    */}
      <div className="w-50 m-auto">
        <Input
        
          size="large"
          onChange={handleFiter}
          type="text"
          className="mb-5"
          placeholder="Search.."
        ></Input>
      </div>
      {/*
      filter: function ends
    */}
      {selecedCategory === null ? (
        <Row className="w-100 justify-content-center">
          {itemsData.map((item) => (
            <Col xs={24} lg={6} md={12} sm={6} key={item._id} className="mx-3">
              <ItemList item={item} />
            </Col>
          ))}
        </Row>
      ) : (
        <Row className="w-100 justify-content-center">
          {itemsData
            ?.filter((i) => i.category === selecedCategory)
            .map((item) => (
              <Col
                xs={24}
                lg={6}
                md={12}
                sm={6}
                key={item._id}
                className="mx-3"
              >
                <ItemList item={item} />
              </Col>
            ))}
        </Row>
      )}
      {selecedCategory && (
        <div className="d-flex justify-content-center">
          <div style={{ width: 400 }}>
            <Button
              onClick={() => {
                
                navigate("/");
              }}
              type="primary"
              block
            >
              Get All Product
            </Button>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
};

export default Homepage;
