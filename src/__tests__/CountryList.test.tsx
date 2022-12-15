import { cleanup, queryByTestId, render, screen, waitFor, waitForElementToBeRemoved, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserEvent } from "@testing-library/user-event/dist/types/setup/setup";
import WS from "jest-websocket-mock";
import CountryList from "../Components/CountryList";
import { fake_payment_methods } from "./fakes/payment_methods";
import { fake_residence_list } from "./fakes/residence_list";

describe("Payment Method", () => {
  let server: WS;
  let user: UserEvent;
  let client: WebSocket;

  beforeEach(async () => {
    user = userEvent.setup();
    server = new WS("wss://ws.binaryws.com/websockets/v3?app_id=1089", {
      jsonProtocol: true,
    });
    client = new WebSocket("wss://ws.binaryws.com/websockets/v3?app_id=1089");
    render(<CountryList websocket={{ current: client }} />);
  });

  afterEach(() => {
    WS.clean();
    cleanup();
  });

  it("Should render Country Dropdown", () => {
    const drop_down = screen.getByTestId('country-dropdown');
    expect(drop_down).toBeInTheDocument();
  });

  it("Should render Get List button", () => {
    const button = screen.getByText(/Get List/);
    expect(button).toBeInTheDocument();
  });

  it("Should render Clear button", () => {
    const button = screen.getByText(/Clear/);
    expect(button).toBeInTheDocument();
  });

  it("Should not render payment methods table on first render", () => {
    const table = screen.queryByRole('table');
    expect(table).not.toBeInTheDocument();
  });

  it("Should get residence list on first render from websocket server", async () => {
    await expect(server).toReceiveMessage({ residence_list: 1 });
  });

  it("Should render the options list properly", async () => {
    server.send(fake_residence_list);
    const options = screen.getAllByRole("option");
    expect(options.length).toBe(fake_residence_list.residence_list.length + 1);
  });

  it("Should have placeholder option as selected", () => {
    const option = screen.getByRole('option', { name: 'Please select a country' })
    expect((option.selected)).toBe(true)
  });

  it("Should render Clear button as disabled", () => {
    const button = screen.getByText(/Clear/);
    expect(button.disabled).toBe(true);
  });

  it("Should change the selected option properly", async () => {
      server.send(fake_residence_list);
      await userEvent.selectOptions(
        screen.getByTestId('country-dropdown'),
        "zw"
      )

      const  selected = screen.getByRole('option', { name: 'Zimbabwe - zw' }) as HTMLOptionElement
      expect(selected.selected).toBe(true)

  });

  it("Should render Clear button as enabled after country selection", async () => {
    server.send(fake_residence_list);
    await userEvent.selectOptions(
      screen.getByTestId('country-dropdown'),
      "zw"
    )
    const  selected = screen.getByRole('option', { name: 'Zimbabwe - zw' })
    expect(selected.selected).toBe(true)

    const button = screen.getByText(/Clear/);
    expect(button.disabled).toBe(false);
  });

  it("Should render the payment methods list on Get List button Click", async () => {
      server.send(fake_payment_methods)
      const rows = screen.getAllByRole("row");
      expect(rows.length -1).toBe(fake_payment_methods.payment_methods.length);
  });

  it("Should clear dropdown on Clear button Click", async () => {
    server.send(fake_residence_list);
    await userEvent.selectOptions(
      screen.getByTestId('country-dropdown'),
      "zw"
    )
    const button = await screen.getByText(/Clear/)
    await userEvent.click(button);
    const option = screen.getByRole('option', { name: 'Please select a country' })
    expect((option.selected)).toBe(true)

  });
});
