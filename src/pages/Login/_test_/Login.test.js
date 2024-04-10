import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import Login from "../Login";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import '@testing-library/jest-dom'

describe("testing login component", () => {

    const mockStore = configureMockStore();

    const initialState = {
        user: {
            user: [],
            imageUrl:[]
        },
        podcasts:{
            podcasts:[]
        }
    };

    const store = mockStore(initialState);


    it("testing text", () => {
        render(
            <BrowserRouter>
                <ToastContainer />
                <Provider store={store}>
                    <Login />
                </Provider>
            </BrowserRouter>
        );

        const text = screen.getAllByText(/Login/i);
        const text1 = screen.getByText(/Don't have an account?/i);

        expect(text[0]).toBeInTheDocument();
        expect(text1).toBeInTheDocument();
    });

    it("testing inputs", async () => {
        render(
            <BrowserRouter>
                <ToastContainer />
                <Provider store={store}>
                    <Login />
                </Provider>
            </BrowserRouter>
        );

        const emailInput = screen.getByPlaceholderText("Enter your email");
        expect(emailInput).toBeInTheDocument()
        await userEvent.type(emailInput, 'rutik@gmail.com');
        expect(emailInput).toHaveValue("rutik@gmail.com");

        const passInput = screen.getByPlaceholderText("Password");
        await userEvent.type(passInput, 'rutik123');
        expect(passInput).toHaveValue("rutik123");

        const btn = screen.getByRole('button');
        await userEvent.click(btn);
        await screen.findByText(/Loading.../i);
    });
});
