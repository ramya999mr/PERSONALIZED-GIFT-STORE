import Link from "next/dist/client/link";
import Image from "next/image";
import classes from "./category.module.css";

function Category(props) {
  const url = `/gallery/?category=${props.slug}`;
  const CategoryLink = (props) => {
    return (
      <Link href={url}>
        <a> {props.children} </a>
      </Link>
    );
  };

  return (
    <CategoryLink>
      <div className={classes.category_root}>
        <div className={classes.container}>
          <figure>
            <div className={classes.img}>
              <Image src={props.img} alt={props.name} width={80} height={80} />
            </div>
          </figure>
          <div className={classes.name}>{props.name}</div>
        </div>
      </div>
    </CategoryLink>
  );
}

export default Category;
