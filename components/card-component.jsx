/*jshint esnext:true, browserify:true, unused:true */
'use strict';

import React from 'react';
import StylingMixin from '../helpers/styling-mixin';

/*
 * Card Component
 */
let Card = React.createClass({
  mixins: [StylingMixin],
  render() {
    let styles = {
      background: "white",
      boxSizing: "border-box",
      minHeight: this.remCalc(60),
      padding: this.remCalc(10),
      width: "100%"
    };
    return (
      <div className="Card" style={styles}>
        {this.props.children}
      </div>
    );
  }
});

export default Card;
