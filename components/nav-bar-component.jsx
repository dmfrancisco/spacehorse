/*jshint esnext:true, browserify:true, unused:true */
'use strict';

import React from 'react/addons';
import StylingMixin from '../helpers/styling-mixin';
import BoardChooser from './board-chooser-component.jsx';
import IconButton from './icon-button-component.jsx';

let PureRenderMixin = React.addons.PureRenderMixin;

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
    currentBoardName: React.PropTypes.string.isRequired,
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
