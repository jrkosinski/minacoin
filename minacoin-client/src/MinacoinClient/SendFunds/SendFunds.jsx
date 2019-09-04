import React from "react";
import PropTypes from "prop-types";
import { connect as connectWithRedux } from "react-redux";

import FetchFailure from "./FetchFailure";
import Placeholder from "./Placeholder";
import { Form, Control } from 'react-redux-form';

import "./SendFunds.css";

const SendFunds = ({ data, hasFailedToFetch }) => {
    const { balance, publicKey } = (data || {});

    const wrapped = (node) => (
        <section className="SendFunds">
            {node}
        </section>
    );

    if (hasFailedToFetch) {
        return wrapped(<FetchFailure className="SendFunds_failure" />);
    }

    if (!data) {
        return wrapped(
            <Form
                model="user"
                //onSubmit={(val) => this.handleSubmit(val)}
            >
                <label>Your name?</label>
                <Control.text model="user.name" />

                <button>Send</button>
            </Form>
        );
    }

    return wrapped(
        <div className="SendFunds_data">

        </div>
    );
};

SendFunds.propTypes = {
    data: PropTypes.shape({
        publicKey: PropTypes.string.isRequired,
        balance: PropTypes.number.isRequired,
    }),
    hasFailedToFetch: PropTypes.bool.isRequired
};

const mapReduxStateToProps = state => ({
    data: state.minacoinClient.sendFunds.responseData,
    hasFailedToFetch: state.minacoinClient.sendFunds.fetchFailure ? true : false,
});


export default connectWithRedux(
    mapReduxStateToProps
)(SendFunds);