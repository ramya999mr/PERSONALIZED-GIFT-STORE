import { Eye } from "@styled-icons/bootstrap";
import { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";
import useSWR from "swr";
import classes from "~/components/tableFilter/table.module.css";
import { dateFormat, fetchData, updateData } from "~/lib/clientFunctions";
import FilterComponent from "../../components/tableFilter";
import Spinner from "../../components/Ui/Spinner";
import PurchaseDetails from "./PurchaseDetails";
import { toast } from "react-toastify";

const PurchaseHistory = (props) => {
  const url = `/api/profile?id=${props.id}`;
  const { data, error, mutate } = useSWR(props.id ? url : null, fetchData);
  const [userData, setUserData] = useState([]);
  const settings = useSelector((state) => state.settings);
  useEffect(() => {
    if (data && data.user) {
      setUserData(data.user.orders);
    }
  }, [data]);

  const [showDetails, setShowDetails] = useState(false);
  const [detailsData, setDetailsData] = useState(null);

  function showPurchaseDetails(id) {
    const _data = userData.find((d) => d.orderId === id);
    setDetailsData(_data);
    setShowDetails(true);
  }

  function hidePurchaseDetails() {
    setDetailsData(null);
    setShowDetails(false);
  }

  async function cancelOrder(id) {
    const resp = await updateData("/api/home/cancel-order", { id });
    resp.success
      ? (toast.success("Order has been canceled successfully"), mutate())
      : toast.error("Something Went Wrong");
  }

  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const filteredItems = userData.filter(
    (item) =>
      item.orderId &&
      item.orderId.toLowerCase().includes(filterText.toLowerCase())
  );

  const subHeaderComponentMemo = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
      }
    };
    return (
      <FilterComponent
        onFilter={(e) => setFilterText(e.target.value)}
        onClear={handleClear}
        filterText={filterText}
        placeholder="Tracking Number"
      />
    );
  }, [filterText, resetPaginationToggle]);

  const columns = [
    {
      name: "Tracking Number",
      selector: (row) => row.orderId,
      grow: 1.5,
    },
    {
      name: "Date",
      selector: (row) => dateFormat(row.orderDate),
      sortable: true,
    },
    {
      name: "Amount",
      selector: (row) => settings.settingsData.currency.symbol + row.payAmount,
    },
    {
      name: "Delivery Status",
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: "Payment Status",
      selector: (row) => row.paymentStatus,
      sortable: true,
    },
    {
      name: "Options",
      selector: (row) => (
        <>
          <div className={classes.button}>
            <Eye
              width={20}
              height={20}
              title="view"
              onClick={() => showPurchaseDetails(row.orderId)}
            />
          </div>
          {row.status !== "Delivered" && row.status !== "Canceled" && (
            <button
              className="btn btn-danger btn-xs p-1"
              onClick={() => cancelOrder(row.orderId)}
            >
              Cancel Order
            </button>
          )}
        </>
      ),
      grow: 2,
    },
  ];

  const customStyles = {
    rows: {
      style: {
        minHeight: "92px",
        fontSize: "15px",
      },
    },
    headCells: {
      style: {
        fontSize: "15px",
      },
    },
  };

  return (
    <>
      {error ? (
        <div className="text-center text-danger">failed to load</div>
      ) : !data ? (
        <Spinner />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={filteredItems}
            pagination
            paginationResetDefaultPage={resetPaginationToggle}
            subHeader
            subHeaderComponent={subHeaderComponentMemo}
            persistTableHead
            customStyles={customStyles}
          />
          {showDetails && detailsData && (
            <PurchaseDetails
              data={detailsData}
              hide={hidePurchaseDetails}
              update={mutate}
            />
          )}
        </>
      )}
    </>
  );
};

export default PurchaseHistory;
