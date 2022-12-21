import React from "react";
import { makeAutoObservable } from "mobx";
import {IPaymentMethod, IResidenceItem} from "../Components/types";
const selectedCountryInitValue = {text:"", value:"",phone_idd:""}
// Model the application state.
class PaymentMethodStore {
    countryList: IResidenceItem[] = [];
    paymentMethods: IPaymentMethod[] = [];
    selectedCountry: IResidenceItem = selectedCountryInitValue
    constructor() {
        makeAutoObservable(this);
    }

    updateCountryList() {
    //     get the data from ws and put it to
        this.countryList = []
    }
    getPaymentMethods(){

    }
    resetPaymentMethods() {
        this.paymentMethods = [];
    }
    resetSelectedCountry(){
        this.selectedCountry = selectedCountryInitValue
    }
}
export default PaymentMethodStore