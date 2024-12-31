import { expect, test } from '@playwright/test';

import { DASHBOARD_PAGES } from '@/shared/routes';
import { inspect_request } from '@/shared/tests/utils';
import { StorageType } from '@/shared/enums';

const mock_host = `https://s3.recloud.tech/autotest?date=${Date.now()}`;
const mock_access_key = `access-key-${Date.now()}`;
const mock_secret_key = `secret-key-${Date.now()}`;

const get_platform_api_endpoint_url = '/api/v1/settings/platform';
const put_platform_api_endpoint_url = '/api/v1/settings/platform';

test.describe('Settings platform', () => {
  test('toggle registration new users', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}${DASHBOARD_PAGES.SETTINGS}`);

    const switch_registration = page.getByRole('switch');
    const button_save = page.getByRole('button', { name: 'Сохранить' });

    const response_platform_raw_old = await inspect_request(page, get_platform_api_endpoint_url);
    const response_platform_json_old = await response_platform_raw_old.json();
    const registration_is_enabled_old = response_platform_json_old.data.registrationIsEnabled;

    await switch_registration.click();
    await button_save.click();

    const response_platform_raw = await inspect_request(page, put_platform_api_endpoint_url);
    const response_platform_json = await response_platform_raw.json();
    const registration_is_enabled = response_platform_json.data.registrationIsEnabled;

    expect(registration_is_enabled_old).not.toBe(registration_is_enabled);
  });

  test('set local storage', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}${DASHBOARD_PAGES.SETTINGS}`);

    const combobox = page.getByRole('combobox');
    const option_local_storage = page.getByLabel('Локальное хранилище');
    const button_save = page.getByRole('button', { name: 'Сохранить' });

    await inspect_request(page, get_platform_api_endpoint_url);

    await combobox.click();
    await option_local_storage.click();
    await button_save.click();

    const response_platform_raw = await inspect_request(page, put_platform_api_endpoint_url);
    const response_platform_json = await response_platform_raw.json();
    const storage_type = response_platform_json.data.storageType;

    expect(storage_type).toBe(StorageType.STORAGE_TYPE_LOCALSTORAGE);
  });

  test('set s3 storage', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}${DASHBOARD_PAGES.SETTINGS}`);

    const combobox = page.getByRole('combobox');
    const option_s3_storage = page.getByLabel('Объектное хранилище S3');
    const input_host = page.getByPlaceholder('Введите хост хранилища');
    const input_access_key = page.getByPlaceholder('Введите Access Key хранилища');
    const input_secret_key = page.getByPlaceholder('Введите Secret Key хранилища');
    const button_save = page.getByRole('button', { name: 'Сохранить' });

    await inspect_request(page, get_platform_api_endpoint_url);

    await combobox.click();
    await option_s3_storage.click();
    await input_host.fill(mock_host);
    await input_access_key.fill(mock_access_key);
    await input_secret_key.fill(mock_secret_key);
    await button_save.click();

    const response_platform_raw = await inspect_request(page, put_platform_api_endpoint_url);
    const response_platform_json = await response_platform_raw.json();
    const storage_type = response_platform_json.data.storageType;
    const storage_host = response_platform_json.data.storageHost;

    expect(storage_type).toBe(StorageType.STORAGE_TYPE_S3);
    expect(storage_host).toBe(mock_host);
  });
});
