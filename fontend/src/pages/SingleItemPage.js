import { message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import DefaultLayout from "../components/DefaultLayout";

export default function SingleItemPage() {
  const { id } = useParams();
  const [item, setItem] = useState({});
  const dispatch = useDispatch();
  useEffect(() => {
    const getItem = async () => {
      try {
        dispatch({
          type: "SHOW_LOADING",
        });
        const { data } = await axios.get(`/item/${id}`);
        setItem(data);
        dispatch({ type: "HIDE_LOADING" });
      } catch (error) {
        dispatch({
          type: "HIDE_LOADING",
        });
        if (error.code === "ERR_NETWORK") {
          message.error("Network Error");
        }
        console.log(error);
      }
    };
    getItem();
  }, [id]);

  return (
    <DefaultLayout>
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <img src={item.image} alt={item.name} className="img-fluid" />
          </div>
          <div className="col-md-6 d-flex justify-content-center align-items-center">
            <div>
              <h1 className="fw-bold text-success border-bottom pb-3">
                {item.name}
              </h1>
              <div className="lead mb-3">
                <span className="fw-bold mr-2 border-bottom pb-2">
                  Description:{" "}
                </span>
                {item?.description}
              </div>
              <h3 >
                <span className="fw-bold mr-2 border-bottom pb-2">Price: </span>
                <span className="text-primary fw-normal">{item.price}</span> tk
              </h3>
              <h3 >
                <span className="fw-bold mr-2 border-bottom pb-2">Category: </span>
                <span className="text-danger fw-normal">{item.category}</span>
              </h3>
              
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
