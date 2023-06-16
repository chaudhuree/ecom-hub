import {
  DeleteOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Modal, Select, Table, message } from "antd";
import axios from "axios";
import DropIn from "braintree-web-drop-in-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "../components/DefaultLayout";
const CartPage = () => {
  const [paymentMethod, setPaymentMethod] = useState(false);
  const [itemsData, setItemsData] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [billPopup, setBillPopup] = useState(false);
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //set token to header
  axios.defaults.headers.common["Authorization"] = JSON.parse(
    localStorage.getItem("auth")
  ).token;
  const { cartItems } = useSelector((state) => state.rootReducer);
  const data = JSON.parse(localStorage.getItem("auth"));
  console.log("user", data.user.name);

  let customerData = {
    customerName: data.user.name,
    customerNumber: data.user.contactNumber,
  };

  const getClientToken = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/bills/braintree/token"
      );
      setClientToken(data.clientToken);
    } catch (err) {
      console.log(err);
    }
  };
  // braintree getTOken
  useEffect(() => {
    getClientToken();
  }, []);
  //useEffect for get all items
  useEffect(() => {
    const getAllItems = async () => {
      try {
        dispatch({
          type: "SHOW_LOADING",
        });
        const { data } = await axios.get(
          "http://localhost:5000/api/items/get-item"
        );
        setItemsData(data);
        dispatch({ type: "HIDE_LOADING" });
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    getAllItems();
  }, [dispatch]);

  const handleIncreament = (record) => {
    itemsData?.map((item) => {
      if (item._id === record._id) {
        if (item.qty === 0 || record.quantity >= item.qty) {
          message.error("Not enough stock");
          return;
        }
        dispatch({
          type: "UPDATE_CART",
          payload: { ...record, quantity: record.quantity + 1 },
        });
      }
    });
  };

  const handleDecreament = (record) => {
    if (record.quantity !== 1) {
      dispatch({
        type: "UPDATE_CART",
        payload: { ...record, quantity: record.quantity - 1 },
      });
    }
  };
  const columns = [
    { title: "Name", dataIndex: "name" },
    {
      title: "Image",
      dataIndex: "image",
      render: (image, record) => (
        <img src={image} alt={record.name} height="60" width="60" />
      ),
    },
    { title: "Price", dataIndex: "price", sorter: (a, b) => a.price - b.price },
    {
      title: "Quantity",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <PlusCircleOutlined
            className="mx-3"
            style={{ cursor: "pointer" }}
            onClick={() => handleIncreament(record)}
          />
          <b>{record.quantity}</b>
          <MinusCircleOutlined
            className="mx-3"
            style={{ cursor: "pointer" }}
            onClick={() => handleDecreament(record)}
          />
        </div>
      ),
    },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => (
        <DeleteOutlined
          style={{ cursor: "pointer" }}
          onClick={() =>
            dispatch({
              type: "DELETE_FROM_CART",
              payload: record,
            })
          }
        />
      ),
    },
  ];

  useEffect(() => {
    let temp = 0;
    cartItems.forEach((item) => (temp = temp + item.price * item.quantity));
    setSubTotal(temp);
  }, [cartItems]);

  //handleSubmit
  const handleSubmit = async (value) => {
    try {
      const { nonce } = await instance.requestPaymentMethod();
      const newObject = {
        ...value,
        userId: JSON.parse(localStorage.getItem("auth")).user._id,
        cartItems,
        nonce,
        subTotal,
        tax: Number(((subTotal / 100) * 10).toFixed(2)),
        totalAmount: Number(
          Number(subTotal) + Number(((subTotal / 100) * 10).toFixed(2))
        ),
        userId: JSON.parse(localStorage.getItem("auth")).user._id,
      };
      // console.log(newObject);
      await axios.post("http://localhost:5000/api/bills/add-bills", newObject, {
        headers: {
          Authorization: `${JSON.parse(localStorage.getItem("auth")).token}`,
        },
      });
      message.success("Bill Generated");
      dispatch({
        type: "EMPTY_CART",
      });
      navigate("/bills");
    } catch (error) {
      // message.error("Something went wrong");
      console.log(error);
    }
  };
  const handleSubmitCash = async (value) => {
    try {
      const newObject = {
        ...value,
        userId: JSON.parse(localStorage.getItem("auth")).user._id,
        cartItems,
        subTotal,
        tax: Number(((subTotal / 100) * 10).toFixed(2)),
        totalAmount: Number(
          Number(subTotal) + Number(((subTotal / 100) * 10).toFixed(2))
        ),
        userId: JSON.parse(localStorage.getItem("auth")).user._id,
      };
      // console.log(newObject);
      await axios.post("http://localhost:5000/api/bills/add-bills", newObject, {
        headers: {
          Authorization: `${JSON.parse(localStorage.getItem("auth")).token}`,
        },
      });
      message.success("Bill Generated");
      dispatch({
        type: "EMPTY_CART",
      });
      navigate("/bills");
    } catch (error) {
      message.error("Something went wrong");
      console.log(error);
    }
  };
  const validatePayment = (_, value) => {
    if (!value) {
      return Promise.reject("Please enter a payment method"); // Custom error message
    }
    return Promise.resolve();
  };
  const handleCheckboxChange = (event) => {
    setPaymentMethod(event.target.checked);
  };
  return (
    <DefaultLayout>
      <h1>Cart Page</h1>
      <Table columns={columns} dataSource={cartItems} bordered />
      <div className="d-flex flex-column align-items-end">
        <hr />
        <h3>
          SUBT TOTAL : $ <b> {subTotal}</b> /-{" "}
        </h3>
        <label>
          <input
            type="checkbox"
            checked={paymentMethod}
            onChange={handleCheckboxChange}
          />
          Card Payment
        </label>
        <Button
          disabled={cartItems.length === 0}
          type="primary"
          onClick={() => setBillPopup(true)}
        >
          Create Invoice
        </Button>
      </div>
      {!paymentMethod ? (
        <Modal
          title="Create Invoice"
          visible={billPopup}
          onCancel={() => setBillPopup(false)}
          footer={false}
        >
          <Form
            initialValues={customerData}
            layout="vertical"
            onFinish={handleSubmitCash}
          >
            <Form.Item name="customerName" label="Customer Name">
              <Input />
            </Form.Item>
            <Form.Item name="customerNumber" label="Contact Number">
              <Input />
            </Form.Item>

            <Form.Item
              name="paymentMode"
              label="Payment Method"
              rules={[{ validator: validatePayment }]}
            >
              <Select>
                <Select.Option value="cash">Cash</Select.Option>
                <Select.Option value="card">Card</Select.Option>
              </Select>
            </Form.Item>
            <div className="bill-it">
              <h5>
                Sub Total : <b>{subTotal}</b>
              </h5>
              <h4>
                TAX
                <b> {((subTotal / 100) * 10).toFixed(2)}</b>
              </h4>
              <h3>
                GRAND TOTAL -
                <b>
                  {Number(subTotal) +
                    Number(((subTotal / 100) * 10).toFixed(2))}
                </b>
              </h3>
            </div>
            <div className="d-flex justify-content-end">
              <Button htmlType="submit" type="primary">
                Pay Now
              </Button>
            </div>
          </Form>
        </Modal>
      ) : (
        <Modal
          title="Create Invoice"
          visible={billPopup}
          onCancel={() => setBillPopup(false)}
          footer={false}
        >
          <Form
            initialValues={customerData}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item name="customerName" label="Customer Name">
              <Input />
            </Form.Item>
            <Form.Item name="customerNumber" label="Contact Number">
              <Input />
            </Form.Item>

            <Form.Item
              name="paymentMode"
              label="Payment Method"
              rules={[{ validator: validatePayment }]}
            >
              <Select>
                <Select.Option value="cash">Cash</Select.Option>
                <Select.Option value="card">Card</Select.Option>
              </Select>
            </Form.Item>
            <div className="bill-it">
              <h5>
                Sub Total : <b>{subTotal}</b>
              </h5>
              <h4>
                TAX
                <b> {((subTotal / 100) * 10).toFixed(2)}</b>
              </h4>
              <h3>
                GRAND TOTAL -{" "}
                <b>
                  {Number(subTotal) +
                    Number(((subTotal / 100) * 10).toFixed(2))}
                </b>
              </h3>
            </div>

            <div className="mt-3">
              {!clientToken ? (
                ""
              ) : (
                <>
                  <DropIn
                    options={{
                      authorization: clientToken,
                      paypal: {
                        flow: "vault",
                      },
                    }}
                    onInstance={(instance) => setInstance(instance)}
                  />
                  <button
                    onClick={handleSubmit}
                    className="btn btn-primary col-12 mt-2"
                  >
                    pay now
                  </button>
                </>
              )}
            </div>

            <div className="d-flex justify-content-end"></div>
          </Form>
        </Modal>
      )}
    </DefaultLayout>
  );
};

export default CartPage;
