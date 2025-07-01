import Image from 'next/image';
import Link from 'next/link';

import classes from './styles.module.css';

import { LoginPluginScriptViewer, SignInForm } from '@/features/auth-credentials-form';
import { AUTH_PAGES } from '@/shared/routes';
import logo from '@/assets/logos/logo.svg';

export default function Page() {
  return (
    <>
      <div className={classes.login}>
        <div className={classes['login__main-content']}>
          <div className={classes.login__form}>
            <div className={classes.login__details}>
              <Image src={logo} className={classes.login__logo} alt="Gml Frontend" />
              <h1 className={classes.login__title}>Авторизация</h1>
              <p className={classes.login__subtitle}>
                Введите свой логин и пароль ниже, чтобы войти в свою учетную запись
              </p>
            </div>
            <SignInForm />
            <LoginPluginScriptViewer />
            <div className={classes.login__registration}>
              Нет аккаунта?{' '}
              <Link href={AUTH_PAGES.SIGN_UP} className={classes.login__link}>
                Регистрация
              </Link>
            </div>
          </div>
        </div>
        <div className={classes.login__banner}>
          <Image src={logo} className={classes['login__banner-image']} alt="Gml Frontend" />
        </div>
      </div>
    </>
  );
}
