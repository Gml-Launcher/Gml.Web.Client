import { test as setup } from '@playwright/test';

import { inspect_toast, type_login, type_password } from '@/shared/tests/utils';

const path = 'playwright/.auth/user.json';

setup('Authorization within the platform', async ({ page, baseURL }) => {
  await page.goto(baseURL || '');

  const button_login = page.getByRole('link', { name: 'Войти' });
  const input_login = page.getByLabel('Введите логин');
  const input_password = page.getByLabel('Введите пароль');
  const button_confirm_login = page.getByRole('button', { name: 'Войти' });

  await button_login.click();
  await type_login(input_login);
  await type_password(input_password);
  await button_confirm_login.click();

  await inspect_toast(page, 'Успешная авторизация');

  await page.context().storageState({ path });
});
