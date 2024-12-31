import { test } from '@playwright/test';

import { DASHBOARD_PAGES } from '@/shared/routes';
import { inspect_toast } from '@/shared/tests/utils';
import { DATA_TEST_ID_DIALOG_GENERATE_LAUNCHER } from '@/shared/constants/data';

const mock_host = `https://api.recloud.tech/autotest?=${Date.now()}`;
const mock_folder = 'launcher';

test.describe('GenerateLauncherDialog', () => {
  test('generate launcher dev-new', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}${DASHBOARD_PAGES.INTEGRATIONS}`);

    const widget = page.getByTestId(DATA_TEST_ID_DIALOG_GENERATE_LAUNCHER);
    const widget_action = widget.getByRole('button', { name: 'Собрать' });

    const combobox_list_method = page.getByRole('combobox');
    const label_branch = page.getByLabel('dev-new');
    const input_endpoint = page.getByPlaceholder('Введите URL к API');
    const input_folder = page.getByPlaceholder('Введите название папки');
    const button_generate = page.getByRole('button', { name: 'Скачать исходники' });

    await widget_action.click();
    await combobox_list_method.click();
    await label_branch.click();
    await input_endpoint.fill(mock_host);
    await input_folder.fill(mock_folder);
    await button_generate.click();

    await inspect_toast(page, 'Проект успешно создан');
  });
});
