import React from "react";
import PropTypes from "prop-types";

const FetchFailure = ({ className }) => (
  <div className={className}>
    Failed to fetch WalletInfo!
  </div>
);

FetchFailure.propTypes = {
  className: PropTypes.string,
};

export default FetchFailure;