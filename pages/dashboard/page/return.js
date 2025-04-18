import dynamic from "next/dynamic";
import DefaultErrorPage from "next/error";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import useSWR from "swr";
import { cpf, fetchData, postData } from "~/lib/clientFunctions";

const Spinner = dynamic(() => import("~/components/Ui/Spinner"));
const TextEditor = dynamic(() => import("~/components/TextEditor"));
const LoadingButton = dynamic(() => import("~/components/Ui/Button"));

const ReturnPolicyPageSetup = () => {
  const [editorState, setEditorState] = useState("");
  const [buttonState, setButtonState] = useState("");

  const url = `/api/page`;
  const { data, error } = useSWR(url, fetchData);

  useEffect(() => {
    if (data && data.page) {
      setEditorState(data.page.returnPolicyPage.content);
    }
  }, [data]);

  const { session } = useSelector((state) => state.localSession);
  const [permissions, setPermissions] = useState({});
  useEffect(() => {
    setPermissions(cpf(session, "pageSettings"));
  }, [session]);

  const updatedValueCb = (data) => {
    setEditorState(data);
  };

  const handleSubmit = async () => {
    setButtonState("loading");
    try {
      const response = await postData(`/api/page?scope=return`, {
        content: editorState,
      });
      response.success
        ? toast.success("Page updated successfully!")
        : toast.error("Something went wrong 500");
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong ", err.message);
    }
    setButtonState("");
  };

  return (
    <>
      {error ? (
        <DefaultErrorPage statusCode={500} />
      ) : !data ? (
        <Spinner />
      ) : (
        <div>
          <div className="py-3">
            <TextEditor
              previousValue={editorState}
              updatedValue={updatedValueCb}
            />
          </div>
          {permissions.edit && (
            <div className="py-3">
              <LoadingButton
                text={"Update"}
                state={buttonState}
                clickEvent={handleSubmit}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

ReturnPolicyPageSetup.requireAuthAdmin = true;
ReturnPolicyPageSetup.dashboard = true;

export default ReturnPolicyPageSetup;
