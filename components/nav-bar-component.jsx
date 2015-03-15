/*jshint esnext:true, browserify:true, unused:true */
'use strict';

import React from 'react';
import StylingMixin from '../helpers/styling-mixin';
import BoardChooser from './board-chooser-component.jsx';

/*
 * NavBar Component
 *
 * Displays the board name and allows switching between boards
 */
let NavBar = React.createClass({
  mixins: [StylingMixin],
  propTypes: {
    boards: React.PropTypes.array,
    currentBoard: React.PropTypes.object.isRequired,
    height: React.PropTypes.string
  },
  getDefaultProps() {
    return {
      boards: []
    };
  },
  render() {
    // Mixin methods can't be used inside `getDefaultProps`
    let height = this.props.height || this.remCalc(54);

    let styles = {
      container: {
        alignItems: "center",
        background: "white",
        boxSizing: "border-box",
        display: "flex",
        height: height,
        padding: this.remCalc(20)
      },
      name: {
        display: "block",
        flex: 1,
        fontSize: this.remCalc(20),
        padding: this.remCalc(8)
      }
    };
    return (
      <div className="NavBar" style={styles.container}>
        <BoardChooser boards={this.props.boards}/>
        <span style={styles.name}>{this.props.currentBoard.name}</span>
      </div>
    );
  }
});

export default NavBar;
