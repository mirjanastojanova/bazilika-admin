import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";

const ActionForm = ({
  _id,
  title: existingTitle,
  description: existingDesc,
  price: existingPrice,
  images: existingImages,
  category: assignedCategory,
}) => {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDesc || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [images, setImages] = useState(existingImages || []);
  const [goToProducts, setGoToProducts] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([false]);
  const [category, setCategory] = useState(assignedCategory || "");

  const router = useRouter();

  useEffect(() => {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }, []);

  async function saveProduct(event) {
    // the default behavior of submit is passing all parametar into the URl
    // because of that should use event.preventDefault();
    event.preventDefault();
    const data = { title, description, price, images, category };
    if (_id) {
      //update
      await axios.put("/api/actions", { ...data, _id });
    } else {
      //create new product
      await axios.post("/api/actions", data);
    }
    setGoToProducts(true);
  }
  if (goToProducts) {
    router.push("/actions");
  }
  const cancelHandler = (event) => {
    event.preventDefault();
    router.push("/actions");
  };
  const uploadImages = async (event) => {
    // this function only uploads photos to the api,
    // it's not changing the product i.g. the DB
    const files = event.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }
      const res = await axios.post("/api/upload", data);
      setImages((oldImages) => {
        return [...oldImages, ...res.data.links];
      });
      setIsUploading(false);
    }
  };

  const deleteImage = async (imageId) => {
    setImages((prev) => {
      const pos = prev.indexOf(imageId);
      if (pos !== -1) {
        // check if the id exists in the cart
        return prev.filter((value, index) => index !== pos); // return all the values except the one that position is on
      }
      return prev;
    });
  };
  const [hoveredImage, setHoveredImage] = useState(null);

  const handleMouseEnter = (link) => {
    setHoveredImage(link);
  };

  const handleMouseLeave = () => {
    setHoveredImage(null);
  };

  const showDeleteButton = (link) => {
    if (link === hoveredImage) {
      return (
        <button
          type="button"
          onClick={() => deleteImage(link)}
          className="btn-red"
        >
          Избриши
        </button>
      );
    }
    return null;
  };

  return (
    <form onSubmit={saveProduct}>
      <label>Име на производ</label>
      <input
        type="text"
        placeholder="Име на производ"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <label>Категорија</label>
      <select value={category} onChange={(ev) => setCategory(ev.target.value)}>
        <option value="">Нема категорија</option>
        {categories.length > 0 &&
          categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
      </select>
      <label>Слики</label>
      <div className="mb-2 flex flex-wrap gap-1">
        {/* arrow function with {} must have a return, and with () it shouldn't*/}
        {!!images?.length &&
          images.map((link) => (
            <div
              key={link}
              className="inline-block h-24"
              onMouseEnter={() => handleMouseEnter(link)}
              onMouseLeave={handleMouseLeave}
            >
              <img src={link} alt="" className="rounded-lg" />
              {showDeleteButton(link)}
            </div>
          ))}
        {isUploading && (
          <div className="h-24 p-1 flex items-center">
            <Spinner />
          </div>
        )}

        <label
          className="w-24 h-24 text-center 
        flex flex-col items-center justify-center 
        text-sm gap-1 text-gray-700 rounded-lg bg-gray-200 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
            />
          </svg>
          Upload
          <input type="file" onChange={uploadImages} className="hidden" />
        </label>
        {!images?.length && <div>Нема слики за овој производ.</div>}
      </div>
      <div className="mt-10">
        <label>Опис на производот</label>
        <textarea
          placeholder="Опис"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        ></textarea>
        <label>Цена (МКД)</label>
        <input
          type="number"
          placeholder="Цена"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
        />
        <div className="flex gap-2">
          <button type="submit" className="btn-primary">
            Зачувај
          </button>
          <button onClick={cancelHandler} className="btn-secondary">
            Откажи
          </button>
        </div>
      </div>
    </form>
  );
};

export default ActionForm;
