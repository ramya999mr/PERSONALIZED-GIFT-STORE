import { Filter } from "@styled-icons/bootstrap/Filter";
import React, { useState } from "react";
import Sidebar from "./sidebar";
import classes from "./sidebarList.module.css";

function SidebarList(props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [clicked, setClicked] = useState(props.query);

  const handleToggle = (index, name) => {
    if (clicked === name) {
      setClicked("");
      props.update("null");
    } else {
      setClicked(name);
      props.update(name);
    }
  };

  const toggleFilter = () => setSidebarOpen(!sidebarOpen);

  return (
    <>
      <div
        className={`${classes.filter_btn} ${sidebarOpen ? classes.b_left : ""}`}
        onClick={toggleFilter}
      >
        <Filter width={33} height={33} />
        <span>Filter</span>
      </div>
      <div
        className={`${classes.sidebar} ${sidebarOpen ? classes.s_left : ""}`}
      >
        <div className={classes.sidebar_inner}>
          <div className="flex-shrink-0">
            <ul className="list-unstyled ps-0">
              {props.category.map((category, index) => (
                <Sidebar
                  onToggle={(name) => handleToggle(index, name)}
                  active={clicked === category.slug}
                  key={category._id}
                  name={category.name}
                  slug={category.slug}
                  image={category.icon[0].url}
                  sub={category.subCategories}
                  update={props.update}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default React.memo(SidebarList);
