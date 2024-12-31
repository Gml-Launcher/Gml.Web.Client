import classes from './styles.module.css';

import { TariffProDialog } from '@/widgets/tariff-pro-modal';

export const DonationPro = () => {
  return (
    <div className={classes.promo__card}>
      <h3 className={classes.promo__title}>Перейти на Pro</h3>
      <p className={classes.promo__description}>Получите максимум возможностей с подпиской Pro!</p>
      <TariffProDialog />
    </div>
  );
};
