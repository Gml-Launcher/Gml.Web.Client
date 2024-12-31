import { test } from '@playwright/test';

import { DASHBOARD_PAGES } from '@/shared/routes';
import {
  inspect_request,
  inspect_toast,
  mock_server_name,
  mock_server_name_edited,
  type_button_delete_server,
  type_button_edit_server,
  type_input_server_description,
  type_input_server_loader,
  type_input_server_name,
  type_input_server_version,
} from '@/shared/tests/utils';

test.describe.configure({ mode: 'serial' });

const url_get_profiles = '/api/v1/profiles';
const url_create_profile = '/api/v1/profiles';
const url_edit_profile = '/api/v1/profiles';
const url_delete_profile = `/api/v1/profiles/${mock_server_name_edited}?removeFiles=true`;
const url_get_info_profile = '/api/v1/profiles/info';

test.describe('Profile', () => {
  test('Create profile', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}${DASHBOARD_PAGES.PROFILES}`);

    const button_create_profile = page.getByRole('button', { name: 'Создать профиль' });
    const button_confirm_create_profile = page.getByRole('button', { name: 'Создать' });

    const locator_server_name = 'Введите название сервера';
    const locator_server_description = 'Введите описание сервера';
    const locator_server_version = 'Выберите версию игры';
    const locator_server_loader = 'Выберите игровой загрузчик';
    const input_server_name = page.getByPlaceholder(locator_server_name);
    const input_server_description = page.getByPlaceholder(locator_server_description);
    const input_server_version = page.locator('button').filter({ hasText: locator_server_version });
    const input_server_loader = page.locator('button').filter({ hasText: locator_server_loader });

    await inspect_request(page, url_get_profiles);
    await button_create_profile.click();
    await type_input_server_name(input_server_name);
    await type_input_server_description(input_server_description);
    await type_input_server_version(page, input_server_version);
    await type_input_server_loader(page, input_server_loader);
    await button_confirm_create_profile.click();
    await inspect_request(page, url_create_profile);

    await inspect_toast(page, `Профиль "${mock_server_name}" успешно создан`);
  });

  test(' Edit profile', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}${DASHBOARD_PAGES.PROFILES}`);

    const table_row_with_server = (locator: string) => page.getByRole('row', { name: locator });
    const locator_server_name = 'Введите название профиля';
    const input_server_name = page.getByPlaceholder(locator_server_name);
    const button_edit_profile = page.getByRole('button', { name: 'Сохранить' });

    await inspect_request(page, url_get_profiles);
    await type_button_edit_server(table_row_with_server(`Выбрать строку ${mock_server_name}`));
    await inspect_request(page, url_get_info_profile);
    await type_input_server_name(input_server_name, mock_server_name_edited);
    await button_edit_profile.click();
    await inspect_request(page, url_edit_profile);

    await page.goto(`${baseURL}${DASHBOARD_PAGES.PROFILES}`);
    await inspect_request(page, url_get_profiles);
    await type_button_edit_server(
      table_row_with_server(`Выбрать строку ${mock_server_name_edited}`),
    );
  });

  test('Delete profile', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}${DASHBOARD_PAGES.PROFILES}`);

    const locator_server = `Выбрать строку ${mock_server_name_edited}`;
    const table_row_with_server = page.getByRole('row', { name: locator_server });
    const button_delete_profile = page.getByRole('button', { name: 'Удалить' });

    await inspect_request(page, url_get_profiles);
    await type_button_delete_server(table_row_with_server, button_delete_profile);
    await inspect_request(page, url_delete_profile);

    await inspect_toast(page, 'Операция выполнена');
  });
});
