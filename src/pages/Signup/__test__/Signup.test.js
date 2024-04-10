import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import Signup from "../Signup";
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


    it("testing text of singup component", () => {
        render(
            <BrowserRouter>
                <ToastContainer />
                <Provider store={store}>
                    <Signup />
                </Provider>
            </BrowserRouter>
        );

        const text = screen.getAllByText(/Signup/i);
        const text1 = screen.getByText(/Already have an account?/i);

        expect(text[0]).toBeInTheDocument();
        expect(text1).toBeInTheDocument();
    });

    it("testing inputs of signup component", async () => {
        render(
            <BrowserRouter>
                <ToastContainer />
                <Provider store={store}>
                    <Signup />
                </Provider>
            </BrowserRouter>
        );

        const name = screen.getByPlaceholderText("Enter your name");
        await userEvent.type(name,'rutik');
        expect(name).toHaveValue("rutik");

        const emailInput = screen.getByPlaceholderText("Enter your email");
        await userEvent.type(emailInput, 'rahul@gmail.com');
        expect(emailInput).toHaveValue("rahul@gmail.com");

        const passInput = screen.getByPlaceholderText("Password");
        await userEvent.type(passInput, 'Test@123');
        expect(passInput).toHaveValue("Test@123");

        const cpasswordInput = screen.getByPlaceholderText("Confirm password");
        await userEvent.type(cpasswordInput, 'Test@123');
        expect(cpasswordInput).toHaveValue("Test@123");

        const btn = screen.getByRole('button');
        await userEvent.click(btn);
        await screen.findByText(/Loading.../i);
    });
});
