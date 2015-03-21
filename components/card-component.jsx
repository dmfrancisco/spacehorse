/*jshint esnext:true, browserify:true, unused:true */
'use strict';

import React from 'react';
import Markdown from '../helpers/markdown';
import StylingMixin from '../helpers/styling-mixin';
import InteractionStylingMixin from '../helpers/interaction-styling-mixin';

/*
 * Card Component
 */
let Card = React.createClass({
  mixins: [StylingMixin, InteractionStylingMixin],
  propTypes: {
    id: React.PropTypes.string.isRequired,
    boardId: React.PropTypes.string.isRequired
  },
  render() {
    // To fit 2 tall cards in a col, the card height must always be less than:
    // (100% board height -1 list header -2 card margins -2 card actions)/2 cards
    let actionsHeight = this.remCalc(30);
    let magicNumber = this.remCalc(16); // 1/2 card list header + bottom margin
    let maxHeight = `calc(50% - ${magicNumber} - ${actionsHeight})`;

    let styles = {
      container: {
        background: "white",
        overflow: "hidden",
        transition: "background 250ms",
        // Avoid buggy line in the bottom of the screen related to -webkit-columns
        marginTop: this.remCalc(1)
      },
      active: {
        background: "rgba(0,0,0,.1)",
        transition: "none"
      },
      content: {
        boxSizing: "border-box",
        color: "inherit",
        display: "block",
        maxHeight: maxHeight,
        overflow: "hidden",
        padding: this.remCalc(8, 10, 0),
        textDecoration: "none",
        width: "100%"
      },
      actions: {
        height: actionsHeight
        // It makes more sense to use a gradient background on an element
        // with position absolute. The problem is that adding position relative
        // to elements inside -webkit-columns is very buggy.
        // outline: `${this.remCalc(10)} solid rgba(255,255,255,.8)`
      }
    };

    let content = this.props.children;
    let renderedContent = Markdown.renderExcerpt(content);
    let href = `/boards/${this.props.boardId}/cards/${this.props.id}`;

    return (
      <div
        {...this.trackInteractionStateActive()}
        style={this.mergeStyles(
          styles.container,
          this.interactionStateIsActive() && styles.active
        )}
        className="Card">
          <a style={styles.content}
            className="Card-content Document Document-excerpt"
            href={href}
            dangerouslySetInnerHTML={{__html: renderedContent}}
          />
          <div className="Card-actions" style={styles.actions} />
      </div>
    );
  }
});

export default Card;
