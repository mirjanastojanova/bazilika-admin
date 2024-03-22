import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductForm from "../../../components/ProductForm";

const EditProductPage = () => {
  const [productInfo, setProductInfo] = useState(null);
  const router = useRouter();
  const { id } = router.query;
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/api/products?id=" + id).then((response) => {
      setProductInfo(response.data);
    });
  }, [id]);
  return (
    <Layout>
      <h1>Смени производ</h1>
      {productInfo && <ProductForm {...productInfo} />}
      {/* first check if productInfo is loaded, 
      if you dont check the fields are not populated
      setting all the props to pass them with {...}*/}
    </Layout>
  );
};

export default EditProductPage;
