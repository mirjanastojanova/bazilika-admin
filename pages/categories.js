import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";
import axios from "axios";

const Categories = ({ swal }) => {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState("");
  const [editedCategory, setEditedCategory] = useState(null);
  const [properties, setProperties] = useState([]);

  // use useEffect because i want this to run on every request for this page
  // and the dependencies is []
  useEffect(() => {
    fetchCategories();
  }, []);
  const fetchCategories = () => {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  };
  const saveCategory = async (event) => {
    event.preventDefault();
    const data = {
      name,
      parentCategory,
      properties: properties.map((p) => ({
        name: p.name,
        values: p.values.split(","),
      })),
    };
    if (editedCategory) {
      // to get the exact category to update
      data._id = editedCategory._id;
      await axios.put("api/categories", data);
      setEditedCategory(null);
    } else {
      await axios.post("/api/categories", data);
    }
    setName("");
    setParentCategory("");
    setProperties("");
    fetchCategories();
  };

  const editCategory = (category) => {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
    setProperties(
      category.properties.map(({ name, values }) => ({
        name,
        values: values.join(","),
      }))
    );
  };

  const deleteCategory = (category) => {
    swal
      .fire({
        // title: "Example",
        text: `Дали сте сигурни дека сакате да ја избришете оваа категорија ${category.name}?`,
        showCancelButton: true,
        cancelButtonTitle: "Откажи",
        confirmButtonText: "Да",
        confirmButtonColor: "#b12822",
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          await axios.delete("/api/categories?_id=" + category._id);
          fetchCategories();
        }
      });
  };

  const addProperty = () => {
    setProperties((prev) => {
      return [...prev, { name: "", values: "" }];
    });
  };

  const handlePropertyNameChange = (property, index, newName) => {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  };
  const handlePropertyValueChange = (property, index, newValues) => {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    });
  };

  const removeProperty = (indexToRemove) => {
    setProperties((prev) => {
      const currentProperties = [...prev];
      let newProperties = currentProperties.filter((p, pIndex) => {
        if (pIndex !== indexToRemove) {
          return pIndex++;
        }
      });
      return newProperties;
    });
  };

  return (
    <Layout>
      <h1>Категории</h1>
      <label>{editedCategory ? `Смени категорија` : "Креирај нова категорија"}</label>
      <form onSubmit={saveCategory}>
        <div className="flex gap-1">
          <input
            type="text"
            placeholder="Име на категорија"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <select
            onChange={(ev) => setParentCategory(ev.target.value)}
            value={parentCategory}
          >
            <option value="">Нема надкатегорија</option>
            {categories?.length > 0 &&
              categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>
        <div className="mb-1">
          {/* <label className="block">Properties</label>
          <button
            onClick={addProperty}
            type="button"
            className="btn-default text-sm mt-1"
          >
            Add New Property
          </button> */}
          {/* {properties.length > 0 &&
            properties.map((index, property) => (
              <div key={property.name} className="flex gap-1 mt-2">
                <input
                  type="text"
                  className="mb-0"
                  value={property.name}
                  placeholder="property name: ex. color"
                  onChange={(ev) =>
                    handlePropertyNameChange(index, property, ev.target.value)
                  }
                />
                <input
                  type="text"
                  className="mb-0"
                  value={property.values}
                  placeholder="values, comma separated"
                  onChange={(ev) =>
                    handlePropertyValueChange(index, property, ev.target.value)
                  }
                />
                <button
                  onClick={() => removeProperty(index)}
                  className="btn-default"
                  type="button"
                >
                  Избриши
                </button>
              </div>
            ))} */}
        </div>
        <div className="flex gap-1">
          {editedCategory && (
            <button
              type="button"
              onClick={() => {
                setEditedCategory(null);
                setName("");
                setParentCategory("");
                setProperties([]);
              }}
              className="btn-default"
            >
              Откажи
            </button>
          )}
        </div>
        <button type="submit" className="btn-primary mt-1">
          Зачувај
        </button>
      </form>
      {!editedCategory && (
        <table className="categories mt-2">
          <thead>
            <tr>
              <td>Име на категорија</td>
              <td>Надкатегорија</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {categories?.length > 0 &&
              categories.map((category) => (
                <tr key={category._id}>
                  <td>{category.name}</td>
                  <td>{category?.parent?.name}</td>
                  <td className="flex gap-1">
                    <button
                      onClick={() => editCategory(category)}
                      className="btn-blue mb-1"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                      Смени
                    </button>
                    <button
                      className="btn-red"
                      onClick={() => {
                        deleteCategory(category);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                      Избриши
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
};

export default withSwal(({ swal }, ref) => <Categories swal={swal} />);
