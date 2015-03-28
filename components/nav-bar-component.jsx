/*jshint esnext:true, browserify:true, unused:true */
'use strict';

import React from 'react/addons';
import Platform from '../helpers/platform';
import StylingMixin from '../helpers/styling-mixin';
import BoardChooser from './board-chooser-component.jsx';
import IconButton from './icon-button-component.jsx';

let PureRenderMixin = React.addons.PureRenderMixin;

if (Platform.nw) {
  // A native menu instead of the dropdown
  BoardChooser = require('./board-chooser-nw-component.jsx');
}

/*
 * NavBar Component
 *
 * Displays the board name and allows switching between boards
 */
let NavBar = React.createClass({
  mixins: [StylingMixin, PureRenderMixin],
  propTypes: {
    appName: React.PropTypes.string.isRequired,
    boards: React.PropTypes.array,
    currentBoard: React.PropTypes.object.isRequired,
    height: React.PropTypes.string.isRequired,
  },
  getDefaultProps() {
    return {
      boards: []
    };
  },
  render() {
    let styles = {
      container: {
        alignItems: "center",
        background: "white",
        boxSizing: "border-box",
        display: "flex",
        height: this.props.height,
        padding: this.remCalc(20)
      },
      titleArea: {
        flex: 1,
        lineHeight: this.props.height
      },
      title: {
        fontSize: this.remCalc(18),
        fontWeight: "600",
        padding: this.remCalc(10)
      }
    };
    return (
      <div className="NavBar" style={styles.container}>
        <div style={styles.titleArea}>
          <span style={styles.title}>{this.props.appName} </span>
          <span>Organized by {this.props.currentBoard.name} </span>
          <BoardChooser
            boards={this.props.boards}
            currentBoardId={this.props.currentBoard.id}
          />
        </div>

        {/* TODO Move this button to a new AppActions component */}
        <IconButton icon="more-vert" size={this.remCalc(24)}/>
      </div>
    );
  }
});

export default NavBar;
