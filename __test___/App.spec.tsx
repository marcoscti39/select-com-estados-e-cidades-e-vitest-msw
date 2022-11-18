import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import "whatwg-fetch";
import "@testing-library/jest-dom";

import { rest } from "msw";
import { setupServer } from "msw/node";

import App from "../src/App";

const handlers = [
  rest.get("https://brasilapi.com.br/api/ibge/uf/v1", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: 2342,
          sigla: "IR",
          nome: "Ilha da Tourette",
          regiao: {
            id: 433,
            sigla: "GY",
            nome: "Supercílio de Cobra",
          },
        },
        {
          id: 2362,
          sigla: "TB",
          nome: "Tchurusbanggo Tudusbago",
          regiao: {
            id: 423,
            sigla: "XZ",
            nome: "Axisnasfli",
          },
        },
      ])
    );
  }),
];

export const server = setupServer(...handlers);

describe("Testing App component", () => {
  beforeAll(() => server.listen());

  beforeEach(() => {
    render(<App />);
  });

  afterEach(() => server.resetHandlers());

  afterAll(() => server.close());

  it("options should appear when you click in the button", () => {
    const openOptionsBtn = screen.getAllByText("^");
    const stateOptions = screen.getAllByRole("complementary");
    fireEvent.click(openOptionsBtn[0]);
    expect(stateOptions[0]).toHaveClass("show-options");
  });

  it("options should desappear when you click in the button again", () => {
    const openOptionsBtn = screen.getAllByText("^");
    const stateOptions = screen.getAllByRole("complementary");

    fireEvent.click(openOptionsBtn[0]);
    fireEvent.click(openOptionsBtn[0]);

    expect(stateOptions[0]).not.toHaveClass("show-options");
  });

  it("when a state is selected the second select should not be disabled", async () => {
    const openOptionsBtn = screen.getAllByText("^");

    const cityOptions = screen.queryAllByRole("complementary")[1];

    fireEvent.click(openOptionsBtn[0]);

    const stateOption = await screen.findByText("Ilha da Tourette");
    fireEvent.click(stateOption);

    expect(cityOptions).not.toBeDisabled();
  });
  it("options should appear when user type something", async () => {
    const user = userEvent.setup();
    const statesInput = screen.getByPlaceholderText("selecione seu estado");

    await user.type(statesInput, "aoba");

    const stateOptions = screen.queryAllByRole("complementary")[0];

    expect(stateOptions).toHaveClass("show-options");
  });
});
