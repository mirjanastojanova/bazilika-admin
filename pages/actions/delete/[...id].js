import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import ActionForm from "../../../components/ActionForm";

const DeleteActionPage = () => {
  const router = useRouter();
  const [actionInfo, setActionInfo] = useState();
  const { id } = router.query;
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/api/actions?id=" + id).then((response) => {
      setProductInfo(response.data);
    });
  }, []);
  const goBack = () => {
    router.push("/actions");
  };
  const deleteProduct = async () => {
    await axios.delete("/api/actions?id=" + id);
    goBack();
  };
  return (
    <Layout>
      <h1 className="text-center">
        Дали сте сигурни дека сакате да го избришете овој производ <b>{actionInfo?.title}</b>?
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

export default DeleteActionPage;
