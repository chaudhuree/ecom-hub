import { Button, Form, Input, message } from "antd";
import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (value) => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      const data = await axios.post("/register", value);
      if (data.status === 201) {
        message.error(data.data.error);
        dispatch({
          type: "HIDE_LOADING",
        });
        return;
      }

      message.success("Register Succesfully");
      window.location.reload();
      navigate("/loginreg");
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      message.error("Something Went Wrong");
      console.log(error);
    }
  };

  //currently login  user
  useEffect(() => {
    if (localStorage.getItem("auth")) {
      localStorage.getItem("auth");
      navigate("/");
    }
  }, [navigate]);
  return (
    <>
      <div className="register">
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="Name">
            <Input />
          </Form.Item>
          <Form.Item name="userId" label="User ID">
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Address">
            <Input />
          </Form.Item>
          <Form.Item name="contactNumber" label="Mobile Number">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="password" label="Password">
            <Input type="password" />
          </Form.Item>

          <div className="d-flex justify-content-between">
            <p className="fs-6">
              ALready Register,{" "}
              <span className="text-primary">Please Login Then..</span>
            </p>
            <Button type="primary" htmlType="submit">
              Register
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default Register;
