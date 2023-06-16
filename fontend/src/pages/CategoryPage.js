import { Button, Form, Input, Modal, Select, message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "./../components/DefaultLayout";
const CategoryPage = () => {
  const [categoriesData, setCategoriesData] = useState([]);
  const [popupModal, setPopupModal] = useState(false);
  const [popupDeleteModal, setPopupDeleteModal] = useState(false);
  const [update, setUpdate] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  //check admin
  const admin = JSON.parse(localStorage.getItem("auth")).user.role === 1;
  //set token to header
  axios.defaults.headers.common["Authorization"] = JSON.parse(
    localStorage.getItem("auth")
  ).token;
  //useEffect for categories
  const getAllCategories = async () => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      const { data } = await axios.get(
        "/get-categories"
      );
      setCategoriesData(data);
      dispatch({ type: "HIDE_LOADING" });
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllCategories();
  }, [dispatch]);

  // handle form  submit
  const handleSubmit = async (value) => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      const res = await axios.post(
        "/create-category",
        value
      );

      message.success("Category Created Succesfully");
      getAllCategories();
      setPopupModal(false);
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      if (error.response.status === 401) {
        return message.error("You are not authorized to do this action");
      }
      message.error("Something Went Wrong");
      console.log(error);
    }
  };
  //update category
  const handleUpdate = async (value) => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      if (value.name && value.id) {
        const data = await axios.put(
          "/update-category/" + value.id,
          { name: value.name, imageUrl: value.imageUrl }
        );

        setPopupDeleteModal(false);
        getAllCategories();
        setUpdate(false);
        dispatch({ type: "HIDE_LOADING" });
        return message.success("Category Updated Succesfully");
      }
      const { data } = await axios.delete(
        "/delete-category/" + value.id
      );

      message.success("Category Deleted Succesfully");

      getAllCategories();
      setPopupDeleteModal(false);
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      if (error.response.status === 401) {
        return message.error("You are not authorized to do this action");
      }
      message.error("Something Went Wrong");
      console.log(error);
    }
  };

  // delete category
  // const handleDelete = async (value) => {
  //   try {
  //     dispatch({
  //       type: "SHOW_LOADING",
  //     });
  //     const { data } = await axios.delete(
  //       "http://localhost:5000/api/category/delete-category/" + value.id
  //     );
  //     console.log("data", data);

  //     message.success("Category Deleted Succesfully");
  //     getAllCategories();
  //     setPopupDeleteModal(false);
  //     dispatch({ type: "HIDE_LOADING" });
  //   } catch (error) {
  //     dispatch({ type: "HIDE_LOADING" });
  //     if (error.response.status === 401) {
  //       return message.error("You are not authorized to do this action");
  //     }
  //     message.error("Something Went Wrong");
  //     console.log(error);
  //   }
  // };
  const setUpdateHandler = (e) => {
    if (e.target.value !== null) {
      setUpdate(true);
    }
  };
  return (
    <DefaultLayout>
      <h1 className="text-success border-bottom pb-2 text-center mb-5">
        Category
      </h1>
      {admin && (
        <>
          <div className="d-flex justify-content-between">
            <Button type="primary" onClick={() => setPopupModal(true)}>
              Add Category
            </Button>
            <Button type="danger" onClick={() => setPopupDeleteModal(true)}>
              Update Category
            </Button>
          </div>
        </>
      )}
      <div className="d-flex flex-wrap justify-content-center align-items-center category-block">
        {categoriesData.map((category) => (
          <div
            key={category.name}
            className={`d-flex category`}
            onClick={() => {
              navigate(`/?category=${category.name}`);
            }}
          >
            <h4>{category.name}</h4>
            <img
              src={category.imageUrl}
              alt={category.name}
              height="40"
              width="60"
            />
          </div>
        ))}
      </div>
      {/*
       modal
     */}
      {popupModal && (
        <Modal
          title={"Add New Category"}
          visible={popupModal}
          onCancel={() => {
            setPopupModal(false);
          }}
          footer={false}
        >
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item name="name" label="Name">
              <Input />
            </Form.Item>
            <Form.Item name="imageUrl" label="Image">
              <Input />
            </Form.Item>
            <div className="d-flex justify-content-end">
              <Button type="primary" htmlType="submit">
                SAVE
              </Button>
            </div>
          </Form>
        </Modal>
      )}
      {popupDeleteModal && (
        <Modal
          title={"Update Category"}
          visible={popupDeleteModal}
          onCancel={() => {
            setPopupDeleteModal(false);
          }}
          footer={false}
        >
          <Form layout="vertical" onFinish={handleUpdate}>
            <Form.Item name="id" label="Category">
              <Select>
                {categoriesData.map((category) => (
                  <Select.Option value={category._id} key={category._id}>
                    {category.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="name" label="Updated Name">
              <Input
                placeholder="Enter Category Name"
                onChange={setUpdateHandler}
              />
            </Form.Item>
            <Form.Item name="imageUrl" label="Image">
              <Input />
            </Form.Item>
            <div className="d-flex justify-content-end">
              <Button type="primary" htmlType="submit">
                {update ? "UPDATE" : "DELETE"}
              </Button>
            </div>
          </Form>
        </Modal>
      )}
    </DefaultLayout>
  );
};

export default CategoryPage;
