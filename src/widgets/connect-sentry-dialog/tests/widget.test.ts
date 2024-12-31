import { expect, test } from '@playwright/test';

import { DASHBOARD_PAGES } from '@/shared/routes';
import { inspect_request } from '@/shared/tests/utils';
import { DATA_TEST_ID_DIALOG_CONNECT_SENTRY } from '@/shared/constants/data';

const mock_host = `https://sentry.recloud.tech/autotest?date=${Date.now()}`;

const get_sentry_api_endpoint_url = '/api/v1/integrations/sentry/dsn';
const put_sentry_api_endpoint_url = '/api/v1/integrations/sentry/dsn';

test.describe('ConnectSentryDialog', () => {
  test('connect sentry', async ({ page, baseURL, browser }) => {
    await page.goto(`${baseURL}${DASHBOARD_PAGES.INTEGRATIONS}`);

    const widget = page.getByTestId(DATA_TEST_ID_DIALOG_CONNECT_SENTRY);
    const widget_action_connect = widget.getByRole('button', { name: 'Подключить' });
    const widget_action_edit = widget.getByRole('button', { name: 'Изменить' });

    const input_endpoint = page.getByPlaceholder('Введите эндпоинт');
    const button_save = page.getByRole('button', { name: 'Сохранить' });

    const response_sentry_raw = await inspect_request(page, get_sentry_api_endpoint_url);
    const response_sentry_json = await response_sentry_raw.json();

    if (Boolean(response_sentry_json.data.url)) {
      await widget_action_edit.click();
    } else {
      await widget_action_connect.click();
    }
    await input_endpoint.fill(mock_host);
    await button_save.click();

    const response_put_sentry_raw = await inspect_request(page, put_sentry_api_endpoint_url);
    const response_put_sentry_json = await response_put_sentry_raw.json();
    expect(response_put_sentry_json.statusCode).toBe(200);
  });
});
