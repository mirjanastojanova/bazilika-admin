import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import styled from "styled-components";

const NewCategoryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
`;

const Input = styled.input`
  margin-top: 5px;
  width: 55%;
  @media screen and (min-width: 768px) {
    width: 300px;
    margin-top: 5px;
  }
`;

const Select = styled.select`
  max-width: 55%;
  @media screen and (min-width: 768px) {
    width: 300px;
  }
`;

const Categories = () => {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState("");
  const [editedCategory, setEditedCategory] = useState(null);
  const [properties, setProperties] = useState([]);

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
      data._id = editedCategory._id;
      await axios.put("/api/categories", data);
      setEditedCategory(null);
    } else {
      await axios.post("/api/categories", data);
    }
    setName("");
    setParentCategory("");
    setProperties([]);
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
    Swal.fire({
      text: `Дали сте сигурни дека сакате да ја избришете оваа категорија ${category.name}?`,
      showCancelButton: true,
      cancelButtonText: "Откажи",
      confirmButtonText: "Да",
      confirmButtonColor: "#b12822",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete("/api/categories?_id=" + category._id);
        fetchCategories();
      }
    });
  };

  const addProperty = () => {
    setProperties((prev) => [...prev, { name: "", values: "" }]);
  };

  const handlePropertyNameChange = (index, property, newName) => {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  };

  const handlePropertyValueChange = (index, property, newValues) => {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    });
  };

  const removeProperty = (indexToRemove) => {
    setProperties((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <Layout>
      <h1>Категории</h1>
      <label>
        {editedCategory ? `Смени категорија` : "Креирај нова категорија"}
      </label>
      <form onSubmit={saveCategory}>
        <NewCategoryGrid>
          <Input
            type="text"
            placeholder="Име на категорија"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <Select
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
          </Select>
        </NewCategoryGrid>

        {/* You can uncomment and use property handling if needed later */}
        {/* <div className="mb-1">
          <button onClick={addProperty} type="button" className="btn-default text-sm mt-1">
            Додади нова опција
          </button>
          {properties.map((property, index) => (
            <div key={index} className="flex gap-1 mt-2">
              <input
                type="text"
                className="mb-0"
                value={property.name}
                placeholder="Име на опција: пример боја"
                onChange={(ev) =>
                  handlePropertyNameChange(index, property, ev.target.value)
                }
              />
              <input
                type="text"
                className="mb-0"
                value={property.values}
                placeholder="вредности, разделени со запирка"
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
          ))}
        </div> */}

        <div className="flex gap-1 mt-2">
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
          <button type="submit" className="btn-primary">
            Зачувај
          </button>
        </div>
      </form>

      {!editedCategory && (
        <table className="basic mt-2">
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
                  <td className="">
                    <button
                      onClick={() => editCategory(category)}
                      className="btn-blue mb-1"
                    >
                      Смени
                    </button>
                    <button
                      className="btn-red"
                      onClick={() => deleteCategory(category)}
                    >
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

export default Categories;
