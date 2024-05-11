import { expect, test } from "@playwright/test";

import { DASHBOARD_PAGES } from "@/shared/routes";
import { inspect_request } from "@/shared/tests/utils";
import { DATA_TEST_ID_DIALOG_CONNECT_TEXTURES } from "@/shared/constants/data";

const mock_skins_endpoint_url = `https://textures.recloud.tech/skin/{userName}?date=${Date.now()}`;
const mock_cloaks_endpoint_url = `https://textures.recloud.tech/cloak/{userName}?date=${Date.now()}`;
const mock_skins_api_endpoint_url = "/api/v1/integrations/texture/skins";
const mock_cloaks_api_endpoint_url = "/api/v1/integrations/texture/cloaks";

test.describe("ConnectTexturesDialog", () => {
  test("connect textures skins and cloaks", async ({ page, baseURL, browser }) => {
    await page.goto(`${baseURL}${DASHBOARD_PAGES.INTEGRATIONS}`);

    const widget = page.getByTestId(DATA_TEST_ID_DIALOG_CONNECT_TEXTURES);
    const widget_action = widget.getByRole("button", { name: "Настроить" });

    const input_skins = page.getByPlaceholder("Введите URL к сервису скинов");
    const input_cloaks = page.getByPlaceholder("Введите URL к сервису плащей");
    const button_save = page.getByRole("button", { name: "Сохранить" });

    await widget_action.click();
    await input_skins.fill(mock_skins_endpoint_url);
    await input_cloaks.fill(mock_cloaks_endpoint_url);
    await button_save.click();

    const response_skins_raw = await inspect_request(page, mock_skins_api_endpoint_url);
    const response_cloaks_raw = await inspect_request(page, mock_cloaks_api_endpoint_url);
    const status_code_skins_json = await response_skins_raw.json();
    const status_code_cloaks_json = await response_cloaks_raw.json();
    const status_code_skins = status_code_skins_json;
    const status_code_cloaks = status_code_cloaks_json;
    expect(status_code_skins.statusCode).toBe(200);
    expect(status_code_cloaks.statusCode).toBe(200);
  });
});
