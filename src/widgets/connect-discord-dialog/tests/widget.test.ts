import { expect, test } from '@playwright/test';

import { DASHBOARD_PAGES } from '@/shared/routes';
import { inspect_request } from '@/shared/tests/utils';
import { DATA_TEST_ID_DIALOG_CONNECT_DISCORD } from '@/shared/constants/data';

const mock_client_id = `${Date.now()}`;
const mock_details = `details-${Date.now()}`;
const mock_large_Image_Key = `large-image-key-${Date.now()}`;
const mock_large_Image_Text = `large-image-text-${Date.now()}`;
const mock_small_Image_Key = `small-image-key-${Date.now()}`;
const mock_small_Image_Text = `small-image-text-${Date.now()}`;

const get_discord_api_endpoint_url = '/api/v1/integrations/discord';
const put_discord_api_endpoint_url = '/api/v1/integrations/discord';

test.describe('ConnectDiscordDialog', () => {
  test('connect discord', async ({ page, baseURL, browser }) => {
    await page.goto(`${baseURL}${DASHBOARD_PAGES.INTEGRATIONS}`);

    const widget = page.getByTestId(DATA_TEST_ID_DIALOG_CONNECT_DISCORD);
    const widget_action_connect = widget.getByRole('button', { name: 'Подключить' });
    const widget_action_edit = widget.getByRole('button', { name: 'Изменить' });

    const input_client_id = page.getByPlaceholder('Введите clientId приложения');
    const input_details = page.getByPlaceholder('Введите details');
    const input_large_Image_Key = page.getByPlaceholder('Введите largeImageKey');
    const input_large_Image_Text = page.getByPlaceholder('Введите largeImageText');
    const input_small_Image_Key = page.getByPlaceholder('Введите smallImageKey');
    const input_small_Image_Text = page.getByPlaceholder('Введите smallImageText');
    const button_save = page.getByRole('button', { name: 'Сохранить' });

    const response_discord_raw = await inspect_request(page, get_discord_api_endpoint_url);
    const response_discord_json = await response_discord_raw.json();

    if (Boolean(response_discord_json.data.clientId)) {
      await widget_action_edit.click();
    } else {
      await widget_action_connect.click();
    }

    await input_client_id.fill(mock_client_id);
    await input_details.fill(mock_details);
    await input_large_Image_Key.fill(mock_large_Image_Key);
    await input_large_Image_Text.fill(mock_large_Image_Text);
    await input_small_Image_Key.fill(mock_small_Image_Key);
    await input_small_Image_Text.fill(mock_small_Image_Text);
    await button_save.click();

    const response_put_discord_raw = await inspect_request(page, put_discord_api_endpoint_url);
    const response_put_discord_json = await response_put_discord_raw.json();
    expect(response_put_discord_json.statusCode).toBe(200);
  });
});
