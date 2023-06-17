import { EyeOutlined } from "@ant-design/icons";
import { Button, Modal, Table } from "antd";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useReactToPrint } from "react-to-print";
import DefaultLayout from "../components/DefaultLayout";
const CutomerPage = () => {
  const componentRef = useRef();
  const [billsData, setBillsData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [popupModal, setPopupModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const dispatch = useDispatch();
  //set token to header
  // axios.defaults.headers.common["Authorization"] = JSON.parse(
  //   localStorage.getItem("auth")
  // ).token;
  const getAllBills = async () => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      const { data } = await axios.get("/get-bills");
      setBillsData(data);
      dispatch({ type: "HIDE_LOADING" });
      console.log(data);
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      console.log(error);
    }
  };
  const getAllUsers = async () => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      const { data } = await axios.get("/allusers");
      setUsersData(data);
      dispatch({ type: "HIDE_LOADING" });
      console.log(data);
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      console.log(error);
    }
  };
  //useEffect
  useEffect(() => {
    getAllBills();
    getAllUsers();
    //eslint-disable-next-line
  }, []);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const columns = [
    {
      title: "Cutomer Name",
      dataIndex: "customerName",
    },
    { title: "Contact No", dataIndex: "customerNumber" },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <EyeOutlined
            style={{ cursor: "pointer" }}
            onClick={() => {
              setSelectedBill(record);
              setPopupModal(true);
            }}
          />
        </div>
      ),
    },
  ];

  const userColumns = [
    { title: "ID ", dataIndex: "_id" },
    {
      title: "User Name",
      dataIndex: "name",
    },
    {
      title: "UserId",
      dataIndex: "userId",
    },
    { title: "Contact No", dataIndex: "contactNumber" },
  ];

  return (
    <DefaultLayout>
      <h1 className="pb-4 text-danger text-center">Cutomer Page</h1>
      <h5 className="text-success border-bottom mb-3 mx-4">ORDERS:</h5>
      <Table
        columns={columns}
        dataSource={billsData.reverse()}
        bordered
        pagination={{
          pageSize: 4,
        }}
      />

      <h5 className="text-primary border-bottom mb-3 mx-4">USERS:</h5>
      <Table
        columns={userColumns}
        dataSource={usersData}
        bordered
        pagination={{
          pageSize: 4,
        }}
      />

      {popupModal && (
        <Modal
          width={400}
          pagination={false}
          title="Invoice Details"
          visible={popupModal}
          onCancel={() => {
            setPopupModal(false);
          }}
          footer={false}
        >
          {/* ============ invoice modal start ==============  */}
          <div id="invoice-POS" ref={componentRef}>
            {/*End InvoiceTop*/}
            <div id="mid">
              <div className="mt-2">
                <p>
                  Customer Name : <b>{selectedBill.customerName}</b>
                  <br />
                  Phone No : <b>{selectedBill.customerNumber}</b>
                  <br />
                  Date : <b>{selectedBill.date.toString().substring(0, 10)}</b>
                  <br />
                </p>
                <hr style={{ margin: "5px" }} />
              </div>
            </div>
            {/*End Invoice Mid*/}
            <div id="bot">
              <div id="table">
                <table>
                  <tbody>
                    <tr className="tabletitle">
                      <td className="item">
                        <h2>Item</h2>
                      </td>
                      <td className="Hours">
                        <h2>Qty</h2>
                      </td>
                      <td className="Rate">
                        <h2>Price</h2>
                      </td>
                      <td className="Rate">
                        <h2>Total</h2>
                      </td>
                    </tr>
                    {selectedBill.cartItems.map((item) => (
                      <>
                        <tr className="service">
                          <td className="tableitem">
                            <p className="itemtext">{item.name}</p>
                          </td>
                          <td className="tableitem">
                            <p className="itemtext">{item.quantity}</p>
                          </td>
                          <td className="tableitem">
                            <p className="itemtext">{item.price}</p>
                          </td>
                          <td className="tableitem">
                            <p className="itemtext">
                              {item.quantity * item.price}
                            </p>
                          </td>
                        </tr>
                      </>
                    ))}

                    <tr className="tabletitle">
                      <td />
                      <td />
                      <td className="Rate">
                        <h2>tax</h2>
                      </td>
                      <td className="payment">
                        <h2>{selectedBill.tax} tk</h2>
                      </td>
                    </tr>
                    <tr className="tabletitle">
                      <td />
                      <td />
                      <td className="Rate">
                        <h2>Grand Total</h2>
                      </td>
                      <td className="payment">
                        <h2>
                          <b>{selectedBill.totalAmount} tk</b>
                        </h2>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/*End Table*/}
            </div>
          </div>
          {/*End Invoice*/}
          <div className="d-flex justify-content-end mt-3">
            <Button type="primary" onClick={handlePrint}>
              Print
            </Button>
          </div>
        </Modal>
      )}
    </DefaultLayout>
  );
};

export default CutomerPage;
