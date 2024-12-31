import Image from 'next/image';
import Link from 'next/link';

import classes from './styles.module.css';

import { SignUpForm } from '@/features/auth-credentials-form';
import { AUTH_PAGES } from '@/shared/routes';
import logo from '@/assets/logos/logo.svg';

export default function Page() {
  return (
    <>
      <div className={classes.register}>
        <div className={classes['register__main-content']}>
          <div className={classes.register__form}>
            <div className={classes.register__details}>
              <Image src={logo} className={classes.register__logo} alt="Gml Frontend" />
              <h1 className={classes.register__title}>Регистрация</h1>
              <p className={classes.register__subtitle}>
                Введите свой адрес электронной почты ниже, чтобы создать свою учетную запись
              </p>
            </div>
            <SignUpForm />
            <div className={classes.register__login}>
              Уже есть аккаунт?{' '}
              <Link href={AUTH_PAGES.SIGN_IN} className={classes.register__link}>
                Войти
              </Link>
            </div>
          </div>
        </div>
        <div className={classes.register__banner}>
          <Image src={logo} className={classes['register__banner-image']} alt="Gml Frontend" />
        </div>
      </div>
    </>
  );
}
