import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import '@testing-library/jest-dom'
import Podcastcard from './Podcastcard'

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


    it("testing fileinput", () => {
        render(
            <BrowserRouter>
                <Provider store={store}>
                    <Podcastcard/>
                </Provider>
            </BrowserRouter>
        );
        expect(screen.getByTestId(/podcast-cards/i)).toBeInTheDocument();
    });

});
