/*jshint esnext:true, browserify:true, unused:true */
'use strict';

import React from 'react/addons';
import IconButton from './icon-button-component.jsx';

let PureRenderMixin = React.addons.PureRenderMixin;
let gui = window.require("nw.gui");

/*
 * Board Chooser Component
 */
let BoardChooser = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    boards: React.PropTypes.array,
    currentBoardId: React.PropTypes.string
  },
  getDefaultProps() {
    return {
      boards: []
    };
  },
  handleToggleClick() {
    let node = this.getDOMNode();
    let rect = node.getBoundingClientRect();
    let x = parseInt(rect.left) - 2;
    let y = parseInt(rect.bottom) + 6;

    this.menu.popup(x, y);
  },
  render() {
    this.menu = new gui.Menu();

    this.props.boards.forEach((board) => {
      let isCurrentBoard = board.id === this.props.currentBoardId;
      let item = new gui.MenuItem({
        label: ` ${board.name}`,
        type: "checkbox",
        checked: isCurrentBoard,
        enabled: !isCurrentBoard,
        click: () => {
          let url = `/boards/${board.id}`;
          this._navigate(url);
        }
      });
      this.menu.append(item);
    });

    let styles = {
      display: "inline-block",
      position: "relative"
    };
    return (
      <div className="BoardChooser" style={styles}>
        <IconButton icon="arrow-down" onClick={this.handleToggleClick}/>
      </div>
    );
  },
  _navigate(url) {
    window.history.pushState(null, null, url); // Set the new location
    window.history.pushState(null, null, url); // Set for popping
    window.history.back();
  }
});

export default BoardChooser;
