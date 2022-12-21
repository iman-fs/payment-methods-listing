import React from "react";
import CountryList from "./Components/CountryList";
import PaymentMethodStore from "./store/PaymentMethod.store";

const App = ({store}: { store: PaymentMethodStore }) => {
    return <CountryList store={store}/>;
};

export default App;
