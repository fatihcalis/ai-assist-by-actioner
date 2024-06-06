import { DEFAULT_THEME, ThemeProvider } from "@zendeskgarden/react-theming";
import React from "react";
import { render } from "react-dom";
import { ClientProvider } from "../providers/client";
import { TicketAnalyzer } from "./ticket_analyzer";

class App {
  constructor(client, appData) {
    this._client = client;
    this._appData = appData;
    this.initializePromise = this.init();
  }

  async init() {
    const container = document.querySelector(".main");

    render(
      <ClientProvider client={this._client}>
        <ThemeProvider theme={{ ...DEFAULT_THEME }}>
          <TicketAnalyzer />
        </ThemeProvider>
      </ClientProvider>,
      container
    );
  }
}

export default App;
