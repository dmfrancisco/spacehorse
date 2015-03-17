/*jshint esnext:true, browserify:true, unused:true */
'use strict';

import React from 'react';
import StylingMixin from '../helpers/styling-mixin';
import ListStore from '../flow/list-store';
import CardList from './card-list-component.jsx';

/*
 * Board Component
 *
 * Currently, consists simply of a title and a list of lists of cards
 */
let Board = React.createClass({
  mixins: [StylingMixin],
  propTypes: {
    id: React.PropTypes.string.isRequired
  },
  getInitialState() {
    return this._getStateFromStore();
  },
  componentWillMount() {
    ListStore.addListener("change", this._onStoreChange);
  },
  componentWillUnmount() {
    ListStore.removeListener("change", this._onStoreChange);
  },
  render() {
    let styles = {
      WebkitColumnGap: this.remCalc(20),
      WebkitColumnWidth: this.remCalc(260),
      boxSizing: "border-box",
      flex: 1,
      padding: this.remCalc(20)
    };
    let listNodes = this.state.lists.map(function(list, index) {
      return (
        <CardList key={index} id={list.id} name={list.name}/>
      );
    });
    return (
      <div className="Board" style={styles}>
        {listNodes}
      </div>
    );
  },
  _onStoreChange() {
    this.setState(this._getStateFromStore());
  },
  _getStateFromStore() {
    return {
      lists: ListStore.getAll(this.props.id)
    };
  }
});

export default Board;