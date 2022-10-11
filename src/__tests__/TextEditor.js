import { render, screen } from '@testing-library/react';
import * as axios from "axios";
import { act } from 'react-dom/test-utils';
import TextEditor from '../pages/TextEditor';


jest.mock("axios");


test('Should show Loading button on first render', async () => {
  axios.get.mockImplementation((url) => {
    if (url === "https://jsramverk-editor-beha20.azurewebsites.net/doc") {
      return Promise.resolve(mockResponse)
    }
  })
  
  render(<TextEditor />);

  const element = screen.queryByText("Loading please wait...")
  
  expect(element).toBeInTheDocument()
});

test('Should show post button after successful api call', async () => {
  axios.get.mockImplementation((url) => {
    if (url === "https://jsramverk-editor-beha20.azurewebsites.net/doc") {
      return Promise.resolve(mockResponse)
    }
  })

  await act(async () => {
    render(<TextEditor />);
  })

  const element = screen.queryByText("Post")

  expect(element).toBeInTheDocument()
});

test('renders a select box', () => {
  render(<TextEditor />);
  
  const selectText = screen.getByText("Choose a document");

  expect(selectText).toBeInTheDocument();
});

const mockResponse = {
  data: [
    {
      _id: "test",
      name: "test",
      html: "test"
    }
  ]
}