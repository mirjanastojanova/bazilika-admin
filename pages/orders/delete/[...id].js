import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import axios from "axios";

const DeleteOrderPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const goBack = () => {
    router.push("/orders");
  };

  const deleteOrder = async () => {
    await axios.delete("/api/orders?id=" + id);
    goBack();
  };
  return (
    <Layout>
      <h1 className="text-center">
        Дали сте сигурни дека сакате да ја избришете оваа нарачка?
      </h1>
      <div className="flex gap-2 justify-center">
        <button className="btn-red" onClick={deleteOrder}>
          Да
        </button>
        <button className="btn-default" onClick={goBack}>
          Не
        </button>
      </div>
    </Layout>
  );
};

export default DeleteOrderPage;
