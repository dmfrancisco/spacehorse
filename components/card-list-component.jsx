/*jshint esnext:true, browserify:true, unused:true */
'use strict';

import React from 'react';
import StylingMixin from '../helpers/styling-mixin';
import CardStore from '../flow/card-store';
import CardActions from '../flow/card-actions';
import Card from './card-component.jsx';

/*
 * CardList Component
 *
 * A simple ordered list of card components
 */
let CardList = React.createClass({
  mixins: [StylingMixin],
  propTypes: {
    id: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired
  },
  getInitialState() {
    return this._getStateFromStore();
  },
  componentWillMount() {
    CardStore.addListener("change", this._onStoreChange);
  },
  componentWillUnmount() {
    CardStore.removeListener("change", this._onStoreChange);
  },
  handleSubmit(e) {
    e.preventDefault();

    let input = this.refs.cardContent.getDOMNode();
    let cardContent = input.value.trim();

    if (cardContent === "") return;
    input.value = '';

    CardActions.create({
      listId: this.props.id,
      content: cardContent
    });
  },
  render() {
    let styles = {
      header: {
        WebkitColumnBreakBefore: "always",
        fontWeight: "bold"
      },
      list: {
        listStyle: "none",
        padding: 0
      },
      listItem: {
        WebkitColumnBreakInside: "avoid",
        display: "block",
        marginBottom: this.remCalc(5)
      }
    };
    let cardNodes = this.state.cards.map((card, index) => {
      return (
        <li style={styles.listItem} key={index}>
          <Card>
            {card.content || "Loading..."}
          </Card>
        </li>
      );
    });
    return (
      <div className="CardList">
        <div style={styles.header}>
          {this.props.name}
        </div>
        <ol className="CardList-cards" style={styles.list}>
          {cardNodes}
        </ol>
        <form onSubmit={this.handleSubmit}>
          <input type="text" ref="cardContent" />
        </form>
      </div>
    );
  },
  _onStoreChange() {
    this.setState(this._getStateFromStore());
  },
  _getStateFromStore() {
    return {
      cards: CardStore.getAll(this.props.id)
    };
  }
});

export default CardList;
