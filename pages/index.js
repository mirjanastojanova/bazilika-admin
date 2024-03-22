import { useSession } from "next-auth/react";
import Layout from "../components/Layout";

export default function Home() {
  const { data: session } = useSession();
  return (
    <Layout>
      <div className="text-blue-900 flex justify-between">
        <h2>
          Најавен корисник: <b>{session?.user?.name}</b>
        </h2>
        <div className="flex bg-gray-300 gap-1 text-black rounded-lg overflow-hidden">
          <img src={session?.user?.image} alt="" className="w-6 h-6" />
          <span className="px-2">{session?.user?.name}</span>
        </div>
      </div>
    </Layout>
  );
}

// flex grow -> to expand to the end of the page, in this case to the right
// mr,mt,ml,mb -> margins (secong letters are top, bottom...)
// p -> padding (exact thing with second letter applies here also)
