import React from "react";
import PaymentMethodStore from "./PaymentMethod.store";

const StoreContext = React.createContext<PaymentMethodStore>({} as PaymentMethodStore);

export const StoreProvider = ({ children, store }:{children: React.ReactNode, store: PaymentMethodStore}) => {
    return (
        <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
    );
};

/* Hook to use store in any functional component */
export const useStore = (): PaymentMethodStore => React.useContext(StoreContext);


