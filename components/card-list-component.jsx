/*jshint esnext:true, browserify:true, unused:true */
'use strict';

import React from 'react/addons';
import StylingMixin from '../helpers/styling-mixin';
import CardStore from '../flow/card-store';
import CardActions from '../flow/card-actions';
import Card from './card-component.jsx';

let PureRenderMixin = React.addons.PureRenderMixin;

/*
 * CardList Component
 *
 * A simple ordered list of card components
 */
let CardList = React.createClass({
  mixins: [StylingMixin, PureRenderMixin],
  propTypes: {
    id: React.PropTypes.string.isRequired,
    boardId: React.PropTypes.string.isRequired,
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
  handleKeyDown(e) {
    if (e.keyCode !== 13 || e.shiftKey) return;
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
    let headerHeight = this.remCalc(22);

    let styles = {
      header: {
        WebkitColumnBreakBefore: "always",
        fontSize: this.remCalc(14),
        height: headerHeight,
        textAlign: "center"
      },
      list: {
        listStyle: "none",
        padding: 0,
        margin: 0
      },
      listItem: {
        WebkitColumnBreakInside: "avoid",
        display: "block",
        marginBottom: this.remCalc(5),

        // -webkit-columns removes the margin on top. This little trick allow us
        // to align cards that have a list header above with the ones that don't
        paddingTop: headerHeight,
        marginTop: `calc(${headerHeight} * -1)`
      },
      textarea: {
        background: "white",
        border: "none",
        fontSize: this.remCalc(14),
        height: this.remCalc(60),
        lineHeight: this.remCalc(20),
        marginTop: 1,
        outline: "none",
        overflowY: "hidden",
        padding: this.remCalc(8, 10),
        resize: "none",
        width: "100%"
      }
    };
    let cardNodes = this.state.cards.map((card, index) => {
      return (
        <li className="CardList-card" style={styles.listItem} key={index}>
          <Card id={card.id} boardId={this.props.boardId}>
            {card.content}
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
        <div style={styles.listItem}>
          <textarea
            ref="cardContent"
            style={styles.textarea}
            onKeyDown={this.handleKeyDown}
          />
        </div>
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
