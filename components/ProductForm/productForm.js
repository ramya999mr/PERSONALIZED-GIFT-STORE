import { useEffect, useRef, useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import { toast } from "react-toastify";
import useSWR from "swr";
import { fetchData, postData } from "~/lib/clientFunctions";
import FileUpload from "../FileUpload/fileUpload";
import TextEditor from "../TextEditor";
import LoadingButton from "../Ui/Button";
import Spinner from "../Ui/Spinner";
import classes from "./productForm.module.css";

const ProductForm = () => {
  const url = `/api/product/create`;
  const { data, error } = useSWR(url, fetchData);
  const product_type = useRef();
  const seo_title = useRef("");
  const seo_desc = useRef("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState([]);
  const [selectedColor, setSelectedColor] = useState([]);
  const [selectedAttr, setSelectedAttr] = useState("");
  const [attrItemList, setAttrItemList] = useState([]);
  const [displayImage, setDisplayImage] = useState([]);
  const [galleryImage, setGalleryImage] = useState([]);
  const [seoImage, setSeoImage] = useState([]);
  const [variantInputList, setVariantInputList] = useState([]);
  const [resetImageInput, setResetImageInput] = useState("");
  const [editorState, setEditorState] = useState("");
  const [buttonState, setButtonState] = useState("");

  useEffect(() => {
    const arrList = [];
    if (selectedColor.length && attrItemList.length) {
      selectedColor.map((color) => {
        attrItemList.map((attr) => {
          const combination = {
            color: color.label,
            attr: attr.label,
            price: "",
            sku: "",
            qty: "",
          };
          arrList.push(combination);
        });
      });
    } else if (selectedColor.length && !attrItemList.length) {
      selectedColor.map((color) => {
        const combination = {
          color: color.label,
          attr: null,
          price: "",
          sku: "",
          qty: "",
        };
        arrList.push(combination);
      });
    } else if (!selectedColor.length && attrItemList.length) {
      attrItemList.map((attr) => {
        const combination = {
          color: null,
          attr: attr.label,
          price: "",
          sku: "",
          qty: "",
        };
        arrList.push(combination);
      });
    }
    setVariantInputList(arrList);
    return () => {
      setVariantInputList([]);
    };
  }, [selectedColor, attrItemList]);

  const updatedValueCb = (data) => {
    setEditorState(data);
  };

  const multiList = (item) => {
    const data = [];
    item.map((x) => data.push(x.value));
    return JSON.stringify(data);
  };

  const changeAttr = (e) => {
    setSelectedAttr(e);
    setAttrItemList([]);
  };

  const updateDisplayImage = (files) => setDisplayImage(files);
  const updateGalleryImage = (files) => setGalleryImage(files);

  const handleInputChange = (e, i) => {
    const { name, value } = e.target;
    const items = [...variantInputList];
    items[i][name] = value;
    setVariantInputList(items);
  };

  const getEditorStateData = (editorData) => {
    const regex = /(<([^>]+)>)/gi;
    const data = !!editorData.replace(regex, "").length ? editorData : "";
    return data;
  };

  const formHandler = async (e) => {
    e.preventDefault();
    if (displayImage.length === 0 || galleryImage.length === 0) {
      return toast.warn("Please fill in all the required fields!");
    }
    setButtonState("loading");
    const form = document.querySelector("#product_form");
    const formData = new FormData(form);
    const displayImg = await JSON.stringify(displayImage);
    const galleryImg = await JSON.stringify(galleryImage);
    const seo = {
      title: seo_title.current.value.trim(),
      description: seo_desc.current.value.trim(),
      image: seoImage,
    };
    formData.append("displayImage", displayImg);
    formData.append("galleryImages", galleryImg);
    formData.append("type", selectedType);
    formData.append("category", multiList(selectedCategory));
    formData.append("subcategory", multiList(selectedSubcategory));
    formData.append("color", JSON.stringify(selectedColor));
    formData.append("attribute", JSON.stringify(attrItemList));
    formData.append("selectedAttribute", selectedAttr);
    formData.append("variant", JSON.stringify(variantInputList));
    formData.append("seo", JSON.stringify(seo));
    formData.append("description", getEditorStateData(editorState));

    await postData("/api/product/create", formData)
      .then((status) => {
        status.success
          ? (toast.success("Product Added Successfully"),
            form.reset(),
            setSelectedCategory([]),
            setSelectedSubcategory([]),
            setVariantInputList([]),
            setSelectedType(""),
            setSelectedColor([]),
            setSelectedAttr([]),
            setResetImageInput("reset"),
            setEditorState(""))
          : toast.error("Something Went Wrong");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something Went Wrong");
      });
    setButtonState("");
  };

  if (error) return <div>failed to load</div>;
  if (!data) return <Spinner />;
  if (!data.success) return <div>Something Went Wrong...</div>;

  const categoryOption = [];
  data.category.map((el) =>
    categoryOption.push({ label: el.name, value: el.slug }),
  );

  const subcategoryOption = [];
  data.category.map((el) =>
    el.subCategories.map((sub) =>
      subcategoryOption.push({ label: sub.name, value: sub.slug }),
    ),
  );

  const colorOption = [];
  data.color.map((color) =>
    colorOption.push({ label: color.name, value: color.value }),
  );

  const attrItemOption = (index) => {
    const item = [];
    data.attribute[index].values.map((attr) =>
      item.push({
        label: attr.name,
        value: attr.name,
        for: data.attribute[index].name,
      }),
    );
    return item;
  };

  return (
    <>
      <h4 className="text-center pt-3 pb-5">Create New Product</h4>
      <form
        id="product_form"
        encType="multipart/form-data"
        onSubmit={formHandler}
      >
        {imageInput()}
        {productInformation()}
        {productDescription()}
        {productType()}
        {productTypeInput()}
        {seoInput()}
        <div className="my-4">
          <LoadingButton type="submit" text="Add Product" state={buttonState} />
        </div>
      </form>
    </>
  );

  function productDescription() {
    return (
      <div className="card mb-5 border-0 shadow">
        <div className="card-header bg-white py-3 fw-bold">
          Product Description
        </div>
        <div className="card-body">
          <div className="py-3">
            <label htmlFor="inp-7" className="form-label">
              Short Description*
            </label>
            <textarea
              id="inp-7"
              className={classes.input + " form-control"}
              name="short_description"
            />
          </div>
          <div className="py-3">
            <label className="form-label">Description</label>
            <TextEditor
              previousValue={editorState}
              updatedValue={updatedValueCb}
              height={300}
            />
          </div>
        </div>
      </div>
    );
  }

  function productTypeInput() {
    return (
      <div>
        {selectedType === "simple" && (
          <div className="card mb-5 border-0 shadow">
            <div className="card-header bg-white py-3 fw-bold">
              Product Information
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="py-3">
                    <label htmlFor="inp-6" className="form-label">
                    Stock Quantity*
                    </label>
                    <input
                      type="number"
                      min="-1"
                      id="inp-6 custom-number"
                      className={classes.input + " form-control"}
                      name="qty"
                      defaultValue={1}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="py-3">
                    <label className="form-label">SKU*</label>
                    <input
                      type="text"
                      className={classes.input + " form-control"}
                      name="sku"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {selectedType === "variable" && (
          <div className="card mb-5 border-0 shadow-sm">
            <div className="card-header bg-white py-3">Product Variation</div>
            <div className="card-body">
              <div className="row py-3">
                <label className="form-label">Colors</label>
                <MultiSelect
                  options={colorOption}
                  onChange={(e) => {
                    setSelectedColor(e);
                  }}
                  value={selectedColor}
                  labelledBy="Select Color"
                />
              </div>
              <div className="py-3">
                <label className="form-label">Attributes</label>
                <select
                  className={classes.input + " form-control"}
                  defaultValue=""
                  onChange={(evt) => changeAttr(evt.target.value)}
                >
                  <option value="" disabled>
                    Select Attribute
                  </option>
                  {data.attribute.map((attr, idx) => (
                    <option value={idx} key={idx}>
                      {attr.name}
                    </option>
                  ))}
                </select>
              </div>
              {selectedAttr.length > 0 && (
                <div className="row py-3">
                  <label className="form-label">
                    {data.attribute[selectedAttr].name}
                  </label>
                  <MultiSelect
                    options={attrItemOption(selectedAttr)}
                    onChange={(e) => {
                      setAttrItemList(e);
                    }}
                    value={attrItemList}
                    labelledBy="Select Item"
                  />
                </div>
              )}
              {variantInputList.length > 0 &&
                variantInputList.map((variant, index) => {
                  return (
                    <div key={index}>
                      <hr />
                      <h6>
                        Variant:{" "}
                        {`${variant.color ? variant.color : ""} ${
                          variant.color && variant.attr ? "+" : ""
                        } ${variant.attr ? variant.attr : ""}`}
                      </h6>
                      <div className="row">
                        <div className="col-12 col-md-4">
                          <div className="py-3">
                            <label className="form-label">
                            Additional Price*(Set 0 to make it free)

                            </label>
                            <input
                              type="number"
                              min="0"
                              id="custom-number"
                              className={classes.input + " form-control"}
                              name="price"
                              required
                              value={variant.price || ""}
                              onChange={(evt) => handleInputChange(evt, index)}
                            />
                          </div>
                        </div>
                        <div className="col-12 col-md-4">
                          <div className="py-3">
                            <label className="form-label">SKU*</label>
                            <input
                              type="text"
                              className={classes.input + " form-control"}
                              name="sku"
                              required
                              value={variant.sku || ""}
                              onChange={(evt) => handleInputChange(evt, index)}
                            />
                          </div>
                        </div>
                        <div className="col-12 col-md-4">
                          <div className="py-3">
                            <label className="form-label">
                            Stock Quantity*
                            </label>
                            <input
                              type="number"
                              id="custom-number"
                              min="-1"
                              className={classes.input + " form-control"}
                              name="qty"
                              required
                              value={variant.qty || ""}
                              onChange={(evt) => handleInputChange(evt, index)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    );
  }

  function productType() {
    return (
      <div className="card mb-5 border-0 shadow">
        <div className="card-header bg-white py-3 fw-bold">Product Type</div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
              <div className="py-3">
                <label htmlFor="inp-110" className="form-label">
                  New Product
                </label>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="inp-110"
                    name="new_product"
                  />
                  <label className="form-check-label" htmlFor="inp-110">
                    Status
                  </label>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="py-3">
                <label htmlFor="inp-11" className="form-label">
                  Trending Product
                </label>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="inp-11"
                    name="trending"
                  />
                  <label className="form-check-label" htmlFor="inp-11">
                    Status
                  </label>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="py-3">
                <label htmlFor="inp-111" className="form-label">
                  Best Selling Product
                </label>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="inp-111"
                    name="best_selling"
                  />
                  <label className="form-check-label" htmlFor="inp-111">
                    Status
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="py-3">
              <label htmlFor="inp-type" className="form-label">
                Product Type*
              </label>
              <select
                id="inp-type"
                ref={product_type}
                className={classes.input + " form-control"}
                required
                onChange={() => setSelectedType(product_type.current.value)}
                defaultValue=""
              >
                <option value="" disabled>
                  Select Product Type
                </option>
                <option value="simple">Simple Product</option>
                <option value="variable">Variable Product</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function productInformation() {
    return (
      <div className="card mb-5 border-0 shadow">
        <div className="card-header bg-white py-3 fw-bold">
          Product Information
        </div>
        <div className="card-body">
          <div className="py-3">
            <label htmlFor="inp-1" className="form-label">
              Name*
            </label>
            <input
              type="text"
              id="inp-1"
              className={classes.input + " form-control"}
              name="name"
              required
            />
          </div>
          <div className="row">
            <div className="col-md-2 col-sm-6">
              <div className="py-3">
                <label htmlFor="inp-2" className="form-label">
                  Unit*
                </label>
                <input
                  type="text"
                  id="inp-2"
                  className={classes.input + " form-control"}
                  name="unit"
                  required
                />
              </div>
            </div>
            
              
                <input
                  type="text"
                  value="1"
                  hidden
                  id="inp-3"
                  className={classes.input + " form-control"}
                  name="unit_val"
                  required
                />
             
            <div className="col-md-2 col-sm-4">
              <div className="py-3">
                <label htmlFor="inp-4" className="form-label">
                  Price*
                </label>
                <input
                  type="number"
                  id="inp-4 custom-number"
                  className={classes.input + " form-control"}
                  name="main_price"
                  required
                />
              </div>
            </div>
            <div className="col-md-2 col-sm-4">
              <div className="py-3">
                <label htmlFor="inp-5" className="form-label">
                  Discount (%)*
                </label>
                <input
                  type="number"
                  id="inp-5 custom-number"
                  placeholder="0%"
                  className=" form-control"
                  name="sale_price"
                  required
                  step="0.1"
                />
              </div>
            </div>


			<div className="col-md-2 col-sm-4">
              <div className="py-3">
                <label htmlFor="inp-5" className="form-label">
                  GST (%)*
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  id="inp-5 custom-number"
                  placeholder="0%"
                  className={classes.input + " form-control"}
                  name="gst"
                  required
                />
              </div>
            </div>





          </div>
          <div className="row">
          <div className="py-3 col-md-6">
            <label className="form-label">Categories*</label>
            <MultiSelect
              options={categoryOption}
              onChange={setSelectedCategory}
              value={selectedCategory}
              labelledBy="Select"
            />
          </div>
          <div className="py-3 col-md-6">
            <label className="form-label">Subcategories*</label>
            <MultiSelect
              options={subcategoryOption}
              onChange={setSelectedSubcategory}
              value={selectedSubcategory}
              labelledBy="Select"
            />
          </div>
          </div>
        </div>
      </div>
    );
  }

  function imageInput() {
    return (
      <div className="card mb-5 border-0 shadow">
        <div className="card-header bg-white py-3 fw-bold">Product Image</div>
        <div class="row">
        <div className="card-body col-md-6">
          <FileUpload
            accept=".jpg,.png,.jpeg"
            label="Thumbnail Image (300px x 300px)*"
            maxFileSizeInBytes={2000000}
            updateFilesCb={updateDisplayImage}
            resetCb={resetImageInput}
          />
  </div>        
  <div className="card-body col-md-6">

          <FileUpload
            accept=".jpg,.png,.jpeg"
            label="Gallery Images (500px x 500px)*"
            multiple
            maxFileSizeInBytes={2000000}
            updateFilesCb={updateGalleryImage}
            resetCb={resetImageInput}
          />
        </div>
        </div>
      </div>
    );
  }

  function seoInput() {
    return (
      <div className="card mb-5 border-0 shadow">
        <div className="card-header bg-white py-3 fw-bold">SEO Meta Tags</div>
        <div className="card-body">
          <div className="py-3">
            <label htmlFor="inp-122" className="form-label">
              Meta Title
            </label>
            <input
              type="text"
              ref={seo_title}
              id="inp-122"
              className="form-control"
            />
          </div>
          <div className="py-3">
            <label htmlFor="inp-222" className="form-label">
              Meta Description
            </label>
            <textarea ref={seo_desc} id="inp-222" className="form-control" />
          </div>
          <FileUpload
            accept=".jpg,.png,.jpeg"
            label="Meta Image"
            maxFileSizeInBytes={2000000}
            updateFilesCb={setSeoImage}
            resetCb={resetImageInput}
          />
        </div>
      </div>
    );
  }
};

export default ProductForm;
