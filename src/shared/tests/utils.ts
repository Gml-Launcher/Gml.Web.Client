import type { Locator, Page, Response } from 'playwright-core';

const mock_created_login = 'autotestuser';
const mock_created_email = 'autotestuser@email.ru';
const mock_created_password = 'autotestuser-AUTOTEST-000';

export const mock_server_name = 'autotestserver';
export const mock_server_name_edited = 'autotestserveredited';
export const mock_server_description = 'Описание профиля autotestserver';
export const mock_server_version = '1.7.10';
export const mock_server_loader = 'Forge';

export const type_login = async (locator: Locator) => {
  await locator.fill(mock_created_login);
};

export const type_password = async (locator: Locator) => {
  await locator.fill(mock_created_password);
};

export const type_input_server_name = async (locator: Locator, custom?: string) => {
  await locator.fill(custom || mock_server_name);
};

export const type_input_server_description = async (locator: Locator, custom?: string) => {
  await locator.fill(custom || mock_server_description);
};

export const type_input_server_version = async (page: Page, locator: Locator, custom?: string) => {
  await locator.click();
  await page.getByLabel(custom || mock_server_version).click();
};

export const type_input_server_loader = async (page: Page, locator: Locator, custom?: string) => {
  await locator.click();
  await page.getByLabel(custom || mock_server_loader).click();
};

export const type_button_edit_server = async (locator_row: Locator) => {
  await locator_row.getByRole('button').first().click();
};

export const type_button_delete_server = async (locator_row: Locator, locator_button: Locator) => {
  await locator_row.getByRole('button').nth(1).click();
  await locator_button.click();
};

export const inspect_toast = async (page: Page, description: string) => {
  await page.waitForSelector(`text="${description}"`);
};

export const inspect_request = async (page: Page, url: string): Promise<Response> => {
  return await page.waitForResponse((response) => response.url().includes(url));
};
