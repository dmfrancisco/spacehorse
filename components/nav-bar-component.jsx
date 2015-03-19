/*jshint esnext:true, browserify:true, unused:true */
'use strict';

import React from 'react';
import StylingMixin from '../helpers/styling-mixin';
import BoardChooser from './board-chooser-component.jsx';
import IconButton from './icon-button-component.jsx';

/*
 * NavBar Component
 *
 * Displays the board name and allows switching between boards
 */
let NavBar = React.createClass({
  mixins: [StylingMixin],
  propTypes: {
    appName: React.PropTypes.string.isRequired,
    boards: React.PropTypes.array,
    currentBoardName: React.PropTypes.string.isRequired,
    height: React.PropTypes.string
  },
  getDefaultProps() {
    return {
      boards: []
    };
  },
  render() {
    // Mixin methods can't be used inside `getDefaultProps`
    let height = this.props.height || this.remCalc(50);

    let styles = {
      container: {
        alignItems: "center",
        background: "white",
        boxSizing: "border-box",
        display: "flex",
        height: height,
        padding: this.remCalc(20)
      },
      titleArea: {
        flex: 1,
        lineHeight: height
      },
      title: {
        fontSize: this.remCalc(18),
        fontWeight: "bold",
        padding: this.remCalc(8)
      }
    };
    return (
      <div className="NavBar" style={styles.container}>
        <div style={styles.titleArea}>
          <span style={styles.title}>{this.props.appName} </span>
          <span>Organized by {this.props.currentBoardName} </span>
          <BoardChooser boards={this.props.boards} />
        </div>

        {/* TODO Move this button to a new AppActions component */}
        <IconButton icon="more-vert" size={this.remCalc(24)}/>
      </div>
    );
  }
});

export default NavBar;
