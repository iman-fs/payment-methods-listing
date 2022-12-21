import React, {useCallback, useEffect, useRef} from "react";
import {IPaymentMethod, IResidenceItem} from "../Components/types";

export const WSHelpers = (setPaymentMethods: { (pms: IPaymentMethod[]): void; (arg0: any): void; }, setCountries: { (countryList: IResidenceItem[]): void; (arg0: any): void; }, toggleLoading: { (): void; (): void; }) => {
    const websocket = useRef<WebSocket>();
    useEffect(() => {
        websocket?.current?.addEventListener("open", () => {
            send({residence_list: 1});
        });

        websocket.current?.addEventListener("message", (message) => {
            const data = JSON.parse(message.data);
            toggleLoading()
            switch (data.msg_type) {
                case "residence_list":
                    setCountries(data?.residence_list);
                    break;
                case "payment_methods":
                    setPaymentMethods(data?.payment_methods);
                    break;
            }
        });

        return () => {
            if ([0, 1].includes(websocket?.current?.readyState || 3)) {
                websocket?.current?.close();
            }
        };
    }, []);

    React.useEffect(() => {
        if (
            !websocket?.current &&
            ![0, 1].includes(websocket?.current?.readyState || 3)
        ) {
            websocket.current = new WebSocket(
                "wss://ws.binaryws.com/websockets/v3?app_id=1089"
            );
        }
    }, []);
    const send = useCallback(
        (message: object) => {
            toggleLoading()

            if (websocket?.current?.readyState === 1) {
                websocket?.current?.send(JSON.stringify(message));
            }
        },
        [websocket]
    );
    return {send}
}
