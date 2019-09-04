import React from "react";
import PropTypes from "prop-types";
import { connect as connectWithRedux } from "react-redux";

import FetchFailure from "./FetchFailure";
import Placeholder from "./Placeholder";

import "./WalletInfo.css";

const WalletInfo = ({ data, hasFailedToFetch }) => {
    const { balance, publicKey } = (data || {});

    const wrapped = (node) => (
        <section className="WalletInfo">
            {node}
        </section>
    );

    if (hasFailedToFetch) {
        return wrapped(<FetchFailure className="WalletInfo_failure" />);
    }

    if (!data) {
        return wrapped(<Placeholder className="WalletInfo_placeholder" />);
    }

    return wrapped(
        <div className="WalletInfo_data">
            <div>address: {publicKey}</div>
            <div>balance: {balance}</div>
        </div>
    );
};

WalletInfo.propTypes = {
    data: PropTypes.shape({
        publicKey: PropTypes.string.isRequired,
        balance: PropTypes.number.isRequired,
    }),
    hasFailedToFetch: PropTypes.bool.isRequired
};

const mapReduxStateToProps = state => ({
    data: state.minacoinClient.walletInfo.fetchedWalletInfo,
    hasFailedToFetch: state.minacoinClient.walletInfo.fetchFailure ? true : false,
});


export default connectWithRedux(
    mapReduxStateToProps
)(WalletInfo);