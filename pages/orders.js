import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import Link from "next/link";
import { Switch } from "@mui/material";
import styled from "styled-components";

const Orders = styled.div`
  overflow-x: scroll;
  max-width: 380px;
  @media screen and (min-width: 768px) {
    overflow-x: hidden;
    max-width: fit-content;
  }
`;

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    axios.get("/api/orders").then((response) => {
      setOrders(response.data);
    });
  };

  const handleDeliveredCheck = async (_id) => {
    // Find the order by _id
    const orderToUpdate = orders.find((order) => order._id === _id);
    if (!orderToUpdate) return;

    // Toggle the delivered status
    const updatedOrder = {
      ...orderToUpdate,
      delivered: !orderToUpdate.delivered,
    };

    // Update the order on the server
    await axios.put("/api/orders", updatedOrder);

    // Update the local state with the updated order
    setOrders(
      orders.map((order) => (order._id === _id ? updatedOrder : order))
    );
  };

  return (
    <Layout>
      <h1>Нарачки</h1>
      <Orders>
        <table className="basic">
          <thead>
            <tr>
              <th>Дата</th>
              {/* <th>Платено</th> */}
              <th>Примател на нарачка</th>
              <th>Производи</th>
              <th>Доставена</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 &&
              orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    {(order.createdAt &&
                      new Date(order.createdAt).toLocaleString()) ||
                      ""}
                  </td>
                  {/* <td className={order.paid ? "text-green-600" : "text-red-600"}>
                  <b>{order.paid ? "Да" : "Не"}</b>
                </td> */}
                  <td>
                    {order.name} {order.email}
                    <br />
                    {order.city} {order.postalCode}
                    <br />
                    {order.country}
                    <br />
                    {order.streetAddress}
                  </td>
                  <td>
                    {order.line_items.map((l) => (
                      <div key={l.price_data.product_data.name}>
                        {l.price_data.product_data.name} x {l.quantity}
                        <br />
                      </div>
                    ))}
                  </td>
                  <td>
                    <div>
                      <Switch
                        checked={order.delivered}
                        onChange={() => handleDeliveredCheck(order._id)}
                      />
                    </div>
                    <div>
                      <Link
                        className="btn-red"
                        href={"/orders/delete/" + order._id}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                        Избриши
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </Orders>
    </Layout>
  );
};

export default OrdersPage;
