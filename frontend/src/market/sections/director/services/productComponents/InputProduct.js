import React from "react";

export const InputProduct = ({
  categories,
  setProduct,
  product,
  inputHandler,
  keyPressed,
  saveHandler,
  producttypes,
  loading,
  units,
  brands,
}) => {
  return (
    <div className="table-container">
      <div className="table-responsive">
        <table className="table m-0">
          <thead>
            <tr>
              <th>Kategoriya</th>
              <th>Mahsulot turi</th>
              <th>Brend</th>
              <th>Mahsulot kodi</th>
              <th>Mahsulot nomi</th>
              <th>O'lchov birliki</th>
              <th>Saqlash</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <select
                  className="form-control form-control-sm selectpicker"
                  id="select"
                  onChange={(e) => {
                    if (e.target.value === "delete") {
                      setProduct({ ...product, category: null });
                    } else {
                      setProduct({ ...product, category: e.target.value });
                    }
                  }}
                  placeholder="Bo'limni tanlang"
                  style={{ minWidth: "70px" }}
                >
                  {categories &&
                    categories.map((category, index) => (
                      <option key={index} value={category._id}>
                        {category.code + " " + category.name}
                      </option>
                    ))}
                  <option value="delete">Kategoriya</option>
                </select>
              </td>
              <td>
                <select
                  className="form-control form-control-sm selectpicker"
                  id="select"
                  onChange={(e) => {
                    if (e.target.value === "delete") {
                      setProduct({ ...product, producttype: null });
                    } else {
                      setProduct({
                        ...product,
                        producttype: e.target.value,
                      });
                    }
                  }}
                  placeholder="Xizmat turini tanlang"
                  style={{ minWidth: "70px" }}
                >
                  {producttypes &&
                    producttypes.map((producttype, ind) => (
                      <option key={ind} value={producttype._id}>
                        {producttype.name}
                      </option>
                    ))}
                  <option value="delete">Mahsulot turi</option>
                </select>
              </td>
              <td>
                <select
                  className="form-control form-control-sm selectpicker"
                  id="select"
                  onChange={(e) => {
                    if (e.target.value === "delete") {
                      setProduct({ ...product, brand: null });
                    } else {
                      setProduct({
                        ...product,
                        brand: e.target.value,
                      });
                    }
                  }}
                  placeholder="Mahsulot brendini tanlang"
                  style={{ minWidth: "70px" }}
                >
                  {brands &&
                    brands.map((b, ind) => (
                      <option key={ind} value={b._id}>
                        {b.name}
                      </option>
                    ))}
                  <option value="delete">Brend</option>
                </select>
              </td>
              <td>
                <input
                  style={{ minWidth: "70px" }}
                  name="code"
                  value={product.code || ""}
                  onKeyUp={keyPressed}
                  onChange={inputHandler}
                  type="number"
                  className="form-control w-75"
                  id="price"
                  placeholder="Mahsulot kodini kiriting"
                />
              </td>
              <td>
                <input
                  style={{ minWidth: "70px" }}
                  name="name"
                  value={product.name || ""}
                  onKeyUp={keyPressed}
                  onChange={inputHandler}
                  type="text"
                  className="form-control w-75"
                  id="shortname"
                  placeholder="Mahsulot nomini kiriting"
                />
              </td>

              <td>
                <select
                  className="form-control form-control-sm selectpicker"
                  id="select"
                  onChange={(e) => {
                    if (e.target.value === "delete") {
                      setProduct({ ...product, unit: null });
                    } else {
                      setProduct({
                        ...product,
                        unit: e.target.value,
                      });
                    }
                  }}
                  placeholder="Xizmat turini tanlang"
                  style={{ minWidth: "70px" }}
                >
                  {units &&
                    units.map((unit, ind) => (
                      <option key={ind} value={unit._id}>
                        {unit.name}
                      </option>
                    ))}
                  <option value="delete">O'lchov birlikini tanlang</option>
                </select>
              </td>
              <td>
                {loading ? (
                  <button className="btn btn-info" disabled>
                    <span className="spinner-border spinner-border-sm"></span>
                    Loading...
                  </button>
                ) : (
                  <button
                    onClick={saveHandler}
                    className="btn btn-info py-1 px-4"
                  >
                    Saqlash
                  </button>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
