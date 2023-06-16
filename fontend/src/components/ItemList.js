import { Badge, Button, Card } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
const ItemList = ({ item }) => {
  const { cartItems } = useSelector((state) => state.rootReducer);
  const [itemInCart, setItemInCart] = useState(false);
  const dispatch = useDispatch();
  //update cart handler
  const handleAddTOCart = () => {
    dispatch({
      type: "ADD_TO_CART",
      payload: { ...item, quantity: 1 },
    });
  };
  const { Meta } = Card;

  //check in the localstorage if the item is already in the cart
  const checkItemInCart = () => {
    if (cartItems) {
      const itemInCart = cartItems.find((x) => x._id === item._id);
      if (itemInCart) {
        setItemInCart(true);
        return true;
      }
    }
    return false;
  };
  useEffect(() => {
    checkItemInCart();
  }, [cartItems]);

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  return (
    <div>
      <Badge.Ribbon
        size="small"
        color={`${item.qty > 0 ? "purple" : "red"}`}
        text={`${item.qty > 0 ? item.qty : "sold out"}`}
      >
        <Card
          style={{ width: 240, marginBottom: 20 }}
          cover={
            <img alt={item.name} src={item.image} style={{ height: 200 }} />
          }
        >
          <div>
            <h6>{capitalizeFirstLetter(item.name)}</h6>
            <h6>Price: {item.price}tk</h6>
          </div>
          <div className="item-button">
            <Button
              disabled={itemInCart || item.qty === 0}
              onClick={() => handleAddTOCart()}
            >{`${
              item.qty === 0
                ? "Not Available"
                : itemInCart === true
                ? "Added"
                : "Add to cart"
            }`}</Button>
          </div>
        </Card>
      </Badge.Ribbon>
    </div>
  );
};

export default ItemList;
