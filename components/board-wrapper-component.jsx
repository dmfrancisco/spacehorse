/*jshint esnext:true, browserify:true, unused:true */
'use strict';

import React from 'react/addons';
import StylingMixin from '../helpers/styling-mixin';
import BoardStore from '../flow/board-store';
import NavBar from './nav-bar-component.jsx';
import Board from './board-component.jsx';

let PureRenderMixin = React.addons.PureRenderMixin;

/*
 * Board Wrapper Component
 *
 * Contains the board and a top bar with some board related actions.
 * Acts as a Controller View from Flux by listening to changes in the store.
 */
let BoardWrapper = React.createClass({
  mixins: [StylingMixin, PureRenderMixin],
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
    let navBarHeight = this.remCalc(50);

    let styles = {
      container: {
        background: "#e7e7e7",
        display: "flex",
        flexDirection: "column",
        height: "100vh"
      },
      board: {
        flex: 1,
        height: `calc(100vh - ${navBarHeight})`,
        overflowX: "auto"
      }
    };
    if (!this.state.currentBoard) {
      return <h2>Board not found</h2>;
    }
    return (
      <div style={styles.container}>
        <NavBar
          currentBoard={this.state.currentBoard}
          boards={this.state.boards}
          appName={this.props.appName}
          height={navBarHeight}
        />
        <div style={styles.board}>
          <Board id={this.state.currentBoard.id}/>
        </div>
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
