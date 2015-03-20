/*jshint esnext:true, browserify:true, unused:true */
'use strict';

import React from 'react';
import StylingMixin from '../helpers/styling-mixin';
import IconButton from './icon-button-component.jsx';

/*
 * Board Chooser Component
 */
let BoardChooser = React.createClass({
  mixins: [StylingMixin],
  propTypes: {
    boards: React.PropTypes.array
  },
  getDefaultProps() {
    return {
      boards: []
    };
  },
  getInitialState() {
    return {
      open: false
    };
  },
  handleToggleClick() {
    let newState = this.state.open ? false : true;
    this.setState({ open: newState });
  },
  render() {
    let styles = {
      container: {
        display: "inline-block",
        position: "relative"
      },
      dropdown: {
        background: "white",
        display: "none",
        lineHeight: "initial",
        listStyle: "none",
        margin: 0,
        padding: this.remCalc(10),
        position: "absolute",
        right: 0,
        whiteSpace: "nowrap",
        zIndex: "100"
      },
      dropdownOpen: {
        display: "block"
      }
    };
    let boardNodes = this.props.boards.map(function(board, index) {
      let url = `/boards/${board.id}`;
      return (
        <li key={index}>
          <a href={url}>{board.name}</a>
        </li>
      );
    });
    return (
      <div className="BoardChooser" style={styles.container}>
        <IconButton icon="arrow-down" onClick={this.handleToggleClick}/>

        <ol className="BoardChooser-dropdown"
          style={this.mergeStyles(
            styles.dropdown,
            this.state.open && styles.dropdownOpen
          )}>
          {boardNodes}
        </ol>
      </div>
    );
  }
});

export default BoardChooser;
