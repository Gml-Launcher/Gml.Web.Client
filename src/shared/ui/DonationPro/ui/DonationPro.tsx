import Link from "next/link";

import { LinkIcon } from "lucide-react";

import { HREF_DISCORD } from "@/shared/constants";

import classes from "./styles.module.css";

export const DonationPro = () => {
  return (
    <div className={classes.promo__card}>
      <div className={classes.promo}>
        <h3 className={classes.promo__title}>Перейти на Pro</h3>
        <p className={classes.promo__description}>
          Получите максимум возможностей с бессрочной подпиской Pro!
        </p>
      </div>
      <Link className={classes.promo__button} target="_blank" href={HREF_DISCORD}>
        <LinkIcon className="mr-2" size={16} />
        Подключить
      </Link>
    </div>
  );
};
