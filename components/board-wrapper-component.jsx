/*jshint esnext:true, browserify:true, unused:true */
'use strict';

import React from 'react';
import BoardStore from '../flow/board-store';
import NavBar from './nav-bar-component.jsx';
import Board from './board-component.jsx';

/*
 * Board Wrapper Component
 *
 * Contains the board and a top bar with some board related actions.
 * Acts as a Controller View from Flux by listening to changes in the store.
 */
let BoardWrapper = React.createClass({
  propTypes: {
    appName: React.PropTypes.string.isRequired,
    currentBoardId: React.PropTypes.string.isRequired,
  },
  getInitialState() {
    return this._getStateFromStore();
  },
  componentWillMount() {
    BoardStore.addListener("change", this._onStoreChange);
  },
  componentWillUnmount() {
    BoardStore.removeListener("change", this._onStoreChange);
  },
  render() {
    let styles = {
      background: "gainsboro",
      display: "flex",
      flexDirection: "column",
      height: "100vh"
    };
    if (!this.state.currentBoard) {
      return <h2>Board not found</h2>;
    }
    return (
      <div style={styles}>
        <NavBar
          currentBoardName={this.state.currentBoard.name}
          boards={this.state.boards}
          appName={this.props.appName}
        />
        <Board id={this.state.currentBoard.id}/>
      </div>
    );
  },
  _onStoreChange() {
    this.setState(this._getStateFromStore());
  },
  _getStateFromStore() {
    return {
      currentBoard: BoardStore.getBoard(this.props.currentBoardId),
      boards: BoardStore.getAll()
    };
  }
});

export default BoardWrapper;
