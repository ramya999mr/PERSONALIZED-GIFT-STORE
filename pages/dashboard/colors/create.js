import { useRef } from "react";
import { toast } from "react-toastify";
import classes from "~/components/ProductForm/productForm.module.css";
import { postData } from "~/lib/clientFunctions";
const NewColor = () => {
  const color_name = useRef();
  const color_value = useRef();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const form = document.getElementById("color_form");
      const formData = new FormData();
      formData.append("name", color_name.current.value);
      formData.append("value", color_value.current.value);
      const response = await postData("/api/colors", formData);
      response.success
        ? (toast.success("Color Added Successfully"), form.reset())
        : toast.error("Something Went Wrong");
    } catch (err) {
      console.log(err);
      toast.error("Something Went Wrong");
    }
  };
  return (
    <>
      <h4 className="text-center pt-3 pb-5">Create New Color</h4>
      <form id="color_form" onSubmit={submitHandler}>
        <div className="mb-4">
          <label htmlFor="inp-1" className="form-label">
            Color Name*
          </label>
          <input
            type="text"
            id="inp-1"
            ref={color_name}
            className={classes.input + " form-control"}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="inp-2" className="form-label">
            Color Value*
          </label>
          <input
            type="text"
            id="inp-2"
            ref={color_value}
            className={classes.input + " form-control"}
            placeholder="#ffffff"
            pattern="^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$"
            required
          />
        </div>
        <div className="my-4">
          <input
            type="submit"
            value="Add Color"
            className="btn btn-lg btn-success"
          />
        </div>
      </form>
    </>
  );
};

NewColor.requireAuthAdmin = true;
NewColor.dashboard = true;

export default NewColor;
