import React from "react";
import ReactDOM from "react-dom";
import App from "./app";
import { act } from "react-dom/test-utils";

it("renders without crashing", () => {
  const div = document.createElement("div");
  const props: any = {
    location: {
      type: "",
      payload: {},
    },
    tabs: [],
    accounts: [],
    transactions: [],
    total: 0,
    onNavigateToTabs: jest.fn(),
    onCreateTabInputChange: jest.fn(),
    onCreateTab: jest.fn(),
    onImportTabInputChange: jest.fn(),
    onImportTab: jest.fn(),
    onSelectTab: jest.fn(),
    onNavigateToAddTransaction: jest.fn(),
    onNavigateToUpdateTransaction: jest.fn(),
    onCloseTransaction: jest.fn(),
    onAddOrUpdateTransaction: jest.fn(),
    onRemoveTransaction: jest.fn(),
    onError: jest.fn(),
    onInitTransactionForm: jest.fn(),
    onResetTransactionForm: jest.fn(),
    onUpdateTransactionForm: jest.fn(),
    onUpdateTransactionSharedForm: jest.fn(),
    onUpdateTransactionDirectForm: jest.fn(),
    onUpdateTransactionParticipant: jest.fn(),
    onAddParticipant: jest.fn(),
    onSetAllJoined: jest.fn(),
  };
  act(() => {
    ReactDOM.render(<App {...props} />, div);
  });
  ReactDOM.unmountComponentAtNode(div);
});
