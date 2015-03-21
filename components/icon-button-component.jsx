/*jshint esnext:true, browserify:true, unused:true */
'use strict';

import React from 'react';
import StylingMixin from '../helpers/styling-mixin';
import InteractionStylingMixin from '../helpers/interaction-styling-mixin';
import Icon from './icon-component.jsx';

/*
 * Icon Button Component
 */
let IconButton = React.createClass({
  mixins: [StylingMixin, InteractionStylingMixin],
  propTypes: {
    icon: React.PropTypes.string,
    onClick: React.PropTypes.func,
    size: React.PropTypes.string
  },
  getDefaultProps() {
    return {
      icon: "menu",
      onClick() {}
    };
  },
  render() {
    // Mixin methods can't be used inside `getDefaultProps`
    let size = this.props.size || this.remCalc(18);

    let styles = {
      background: "none",
      border: "none",
      borderRadius: "50%",
      cursor: "pointer",
      lineHeight: 0,
      outline: "none",
      padding: this.remCalc(2),
      transition: "background 250ms",
      verticalAlign: "middle"
    };
    let activeStyles = {
      background: "rgba(0,0,0,.1)",
      transition: "none"
    };
    return (
      <button
        {...this.trackInteractionStateActive()}
        style={this.mergeStyles(
          styles,
          this.interactionStateIsActive() && activeStyles
        )}
        onClick={this.props.onClick}>
        <Icon icon={this.props.icon} size={size}/>
      </button>
    );
  }
});

export default IconButton;
