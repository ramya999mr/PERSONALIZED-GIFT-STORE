import Image from "next/image";
import { dateFormat } from "~/lib/clientFunctions";
import cls from "./review.module.css";

export default function Review({ review }) {
  function _rating(p) {
    let _r = "";
    for (let i = 0; i < p; i++) {
      _r = _r + "★";
    }
    return _r;
  }

  return (
    <div className={cls.container}>
      <ol>
        {review.map((item, idx) => (
          <li key={item._id}>
            <Image
              src="/images/avatar.png"
              width={55}
              height={55}
              alt="avatar"
              layout="fixed"
            />
            <div className={cls.review_text}>
              <div>
                <p className={cls.author}>
                  <strong>{item.userName}</strong>&nbsp;-&nbsp;
                  <span>{dateFormat(item.date)}</span>
                </p>
                <span className={cls.rating}>{_rating(item.rating)}</span>
              </div>
              <p>{item.comment}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
