import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import Podcast from "../Podcast";
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import '@testing-library/jest-dom'

describe("testing component", () => {

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


    it("testing podcast page", () => {
        render(
            <BrowserRouter>
                <Provider store={store}>
                    <Podcast/>
                </Provider>
            </BrowserRouter>
        );
        expect(screen.getByText(/Podcasts/i)).toBeInTheDocument();
    });

    it("testing searchbar",async () => {
        render(
            <BrowserRouter>
                <Provider store={store}>
                    <Podcast/>
                </Provider>
            </BrowserRouter>
        );

        const input = screen.getByPlaceholderText(/Search for podcasts/i)
        await userEvent.type(input,'example');
        expect(input).toHaveValue('example')
    });

});
