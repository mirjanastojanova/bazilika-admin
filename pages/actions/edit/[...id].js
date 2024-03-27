import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import ActionForm from "../../../components/ActionForm";

const EditActionPage = () => {
  const [actionInfo, setActionInfo] = useState(null);
  const router = useRouter();
  const { id } = router.query;
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/api/actions?id=" + id).then((response) => {
      setActionInfo(response.data);
    });
  }, [id]);
  return (
    <Layout>
      <h1>Смени производ</h1>
      {actionInfo && <ActionForm {...actionInfo} />}
      {/* first check if actionInfo is loaded, 
      if you dont check the fields are not populated
      setting all the props to pass them with {...}*/}
    </Layout>
  );
};

export default EditActionPage;
