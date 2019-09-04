import React from "react";

import WalletInfo from "./WalletInfo";
import SendFunds from "./SendFunds";
//import SendFunds from "./SendFunds";
import { fetchWalletInfoAction } from './actions';
import { connect as connectWithRedux } from "react-redux";

class MinacoinClient extends React.Component {

    render () {
        return (
            <React.Fragment>
                <h1>MinacoinClient</h1>
                <WalletInfo />
                <SendFunds />
            </React.Fragment>
        );
    }

    componentDidMount() {
        this.props.fetchWalletInfoAction();
    }
}

const mapStateToProps = ({ data = {} }) => ({
    data
});

export default connectWithRedux(
    mapStateToProps,
    {
        fetchWalletInfoAction
    }
  )(MinacoinClient);

//export default MinacoinClient;