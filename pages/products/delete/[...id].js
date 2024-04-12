import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductForm from "../../../components/ProductForm";

const DeleteProductPage = () => {
  const router = useRouter();
  const [productInfo, setProductInfo] = useState();
  const { id } = router.query;

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/api/products?id=" + id).then((response) => {
      setProductInfo(response.data);
    });
  }, []);
  const goBack = () => {
    router.push("/products");
  };
  const deleteProduct = async () => {
    // await axios.delete("/api/upload?id=" + id, {
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
    await axios.delete("/api/products?id=" + id);
    goBack();
  };
  return (
    <Layout>
      <h1 className="text-center">
        Дали сте сигурни дека сакате да го избришете овој производ{" "}
        <b>{productInfo?.title}</b>?
      </h1>
      <div className="flex gap-2 justify-center">
        <button className="btn-red" onClick={deleteProduct}>
          Да
        </button>
        <button className="btn-default" onClick={goBack}>
          Не
        </button>
      </div>
    </Layout>
  );
};

export default DeleteProductPage;
