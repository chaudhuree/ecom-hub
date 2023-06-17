import { Tabs } from "antd";
import React from "react";
import Login from "../components/Login";
import Register from "../components/Register";


const onChange = (key) => {
  console.log(key);
};
const LoginRegisterPage = () => (
  <>
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
        <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Login" key="1">
          <Login />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Register" key="2">
          <Register />
        </Tabs.TabPane>
        
      </Tabs>
        </div>
      </div>
    </div>
  </>
);
export default LoginRegisterPage;


