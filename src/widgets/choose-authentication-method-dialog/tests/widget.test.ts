import { test } from '@playwright/test';

import { DASHBOARD_PAGES } from '@/shared/routes';
import { DATA_TEST_ID_DIALOG_AUTHENTICATION_METHOD } from '@/shared/constants/data';
import { inspect_toast } from '@/shared/tests/utils';

const mock_host_azuriom = `https://azuriom.recloud.tech/autotest=${Date.now()}`;
const mock_host_datalife = `https://datalife.recloud.tech/autotest=${Date.now()}`;
const mock_host_easycabinet = `https://easycabinet.recloud.tech/autotest=${Date.now()}`;

test.describe('ChooseAuthenticationMethodDialog', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(`${baseURL}${DASHBOARD_PAGES.INTEGRATIONS}`);
  });

  test('choose undefined', async ({ page }) => {
    const widget = page.getByTestId(DATA_TEST_ID_DIALOG_AUTHENTICATION_METHOD);
    const widget_action = widget.getByRole('button', { name: 'Изменить' });

    const combobox_list_method = page.getByRole('combobox');
    const label_undefined = page.getByLabel('Undefined');
    const button_save = page.getByRole('button', { name: 'Сохранить' });

    await widget_action.click();
    await combobox_list_method.click();
    await label_undefined.click();
    await button_save.click();

    await inspect_toast(page, 'Сервис авторизации успешно обновлен');
  });

  test('choose Any', async ({ page }) => {
    const widget = page.getByTestId(DATA_TEST_ID_DIALOG_AUTHENTICATION_METHOD);
    const widget_action = widget.getByRole('button', { name: 'Изменить' });

    const combobox_list_method = page.getByRole('combobox');
    const label_any = page.getByLabel('Any');
    const button_save = page.getByRole('button', { name: 'Сохранить' });

    await widget_action.click();
    await combobox_list_method.click();
    await label_any.click();
    await button_save.click();

    await inspect_toast(page, 'Сервис авторизации успешно обновлен');
  });

  test('choose Azuriom', async ({ page }) => {
    const widget = page.getByTestId(DATA_TEST_ID_DIALOG_AUTHENTICATION_METHOD);
    const widget_action = widget.getByRole('button', { name: 'Изменить' });

    const combobox_list_method = page.getByRole('combobox');
    const label_azuriom = page.getByLabel('Azuriom');
    const input_endpoint = page.getByPlaceholder('Введите ссылку на Ваш сайт');
    const button_save = page.getByRole('button', { name: 'Сохранить' });

    await widget_action.click();
    await combobox_list_method.click();
    await label_azuriom.click();
    await input_endpoint.fill(mock_host_azuriom);
    await button_save.click();

    await inspect_toast(page, 'Сервис авторизации успешно обновлен');
  });

  test('choose DataLife Engine', async ({ page }) => {
    const widget = page.getByTestId(DATA_TEST_ID_DIALOG_AUTHENTICATION_METHOD);
    const widget_action = widget.getByRole('button', { name: 'Изменить' });

    const combobox_list_method = page.getByRole('combobox');
    const label_datalife_engine = page.getByLabel('DataLife Engine');
    const input_endpoint = page.getByPlaceholder('Введите эндпоинт');
    const button_save = page.getByRole('button', { name: 'Сохранить' });

    await widget_action.click();
    await combobox_list_method.click();
    await label_datalife_engine.click();
    await input_endpoint.fill(mock_host_datalife);
    await button_save.click();

    await inspect_toast(page, 'Сервис авторизации успешно обновлен');
  });

  test('choose EasyCabinet', async ({ page }) => {
    const widget = page.getByTestId(DATA_TEST_ID_DIALOG_AUTHENTICATION_METHOD);
    const widget_action = widget.getByRole('button', { name: 'Изменить' });

    const combobox_list_method = page.getByRole('combobox');
    const label_easy_cabinet = page.getByLabel('EasyCabinet');
    const input_endpoint = page.getByPlaceholder('Введите ссылку на ваш Backend');
    const button_save = page.getByRole('button', { name: 'Сохранить' });

    await widget_action.click();
    await combobox_list_method.click();
    await label_easy_cabinet.click();
    await input_endpoint.fill(mock_host_easycabinet);
    await button_save.click();

    await inspect_toast(page, 'Сервис авторизации успешно обновлен');
  });
});
