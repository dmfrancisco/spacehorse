/*jshint esnext:true, browserify:true, unused:true */
'use strict';

import React from 'react/addons';

let PureRenderMixin = React.addons.PureRenderMixin;

/*
 * Subset of the SVG icon collection from the Polymer project (goo.gl/N7SB5G)
 */
let Icon = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    icon: React.PropTypes.string.isRequired,
    size: React.PropTypes.string.isRequired
  },
  renderGraphic() {
    switch (this.props.icon) {
      case 'arrow-down':
        return (
          <g><path d="M7.41 7.84l4.59 4.58 4.59-4.58 1.41 1.41-6 6-6-6z"/></g>
        );
      case 'arrow-up':
        return (
          <g><path d="M7.41 15.41l4.59-4.58 4.59 4.58 1.41-1.41-6-6-6 6z"/></g>
        );
      case 'content':
        return (
          <g><path d="m24 10h-24v4h24v-4m0-8h-24v4h24v-4m-24 20h16v-4h-16v4"/></g>
        );
      case 'menu':
        return (
          <g><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></g>
        );
      case 'more-vert':
        return (
          <g><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1
            0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2
            2-.9 2-2-.9-2-2-2z"></path></g>
        );
    }
  },
  render() {
    let style = {
      // Use CSS instead of the width prop to support non-pixel units (eg: rem)
      width: this.props.size
    };
    return (
      <svg viewBox="0 0 24 24"
        style={style}
        preserveAspectRatio="xMidYMid meet"
        fit>
        {this.renderGraphic()}
      </svg>
    );
  }
});

export default Icon;
