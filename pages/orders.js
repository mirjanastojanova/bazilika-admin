import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";

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
  return (
    <Layout>
      <h1>Нарачки</h1>
      <table className="basic">
        <thead>
          <tr>
            <th>Дата</th>
            <th>Платено</th>
            <th>Примател на нарачка</th>
            <th>Производи</th>
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
                <td className={order.paid ? 'text-green-600' : 'text-red-600'}><b>{order.paid ? 'Да' : "Не"}</b></td>
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
                    <>
                      {l.price_data.product_data.name} x {l.quantity}
                      <br />
                    </>
                  ))}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default OrdersPage;
