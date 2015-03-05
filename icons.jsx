/*jshint esnext:true, browser:true */
'use strict';

import React from 'react';

/*
 * Subset of the SVG icon collection from the Polymer project (goo.gl/N7SB5G)
 */
export default React.createClass({
  propTypes: {
    height: React.PropTypes.string,
    icon: React.PropTypes.string.isRequired,
    width: React.PropTypes.string
  },
  getDefaultProps() {
    return {
      height: '22px',
      width: '22px'
    };
  },
  renderGraphic() {
    switch (this.props.icon) {
      case 'menu':
        return (
          <g><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></g>
        );
      case 'arrow-down':
        return (
          <g><path d="M7.41 7.84l4.59 4.58 4.59-4.58 1.41 1.41-6 6-6-6z"/></g>
        );
      case 'arrow-up':
        return (
          <g><path d="M7.41 15.41l4.59-4.58 4.59 4.58 1.41-1.41-6-6-6 6z"/></g>
        );
    }
  },
  render() {
    return (
      <svg viewBox="0 0 24 24"
        height={this.props.height}
        width={this.props.width}
        preserveAspectRatio="xMidYMid meet"
        fit>
        {this.renderGraphic()}
      </svg>
    );
  }
});
