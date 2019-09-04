import React from "react";
import PropTypes from "prop-types";

const Placeholder = ({ className }) => (
  <div className={className}>
      getting wallet info...
  </div>
);

Placeholder.propTypes = {
  className: PropTypes.string,
};

export default Placeholder;