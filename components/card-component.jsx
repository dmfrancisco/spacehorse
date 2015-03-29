/*jshint esnext:true, browserify:true, unused:true */
'use strict';

import React from 'react/addons';
import Markdown from '../helpers/markdown';
import StylingMixin from '../helpers/styling-mixin';
import InteractionStylingMixin from '../helpers/interaction-styling-mixin';
import Icon from './icon-component.jsx';

let PureRenderMixin = React.addons.PureRenderMixin;

/*
 * Card Component
 */
let Card = React.createClass({
  mixins: [StylingMixin, InteractionStylingMixin, PureRenderMixin],
  propTypes: {
    id: React.PropTypes.string.isRequired,
    boardId: React.PropTypes.string.isRequired
  },
  render() {
    // To fit 2 tall cards in a col, the card height must always be less than:
    // (100% board height -1 list header -2 card margins -2 card actions)/2 cards
    let footerHeight = this.remCalc(32);
    let magicNumber = this.remCalc(16); // 1/2 card list header + bottom margin
    let maxHeight = `calc(50% - ${magicNumber} - ${footerHeight})`;

    let styles = {
      container: {
        background: "white",
        overflow: "hidden",
        transition: "background 250ms",
        // Avoid buggy line in the bottom of the screen related to -webkit-columns
        marginTop: 1
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
      footer: {
        alignItems: "center",
        boxSizing: "border-box",
        display: "flex",
        height: footerHeight,
        padding: this.remCalc(0, 10)
      }
    };

    let content = this.props.children;
    let { html, more } = Markdown.renderExcerpt(content);
    let href = `/boards/${this.props.boardId}/cards/${this.props.id}`;

    return (
      <div
        style={this.mergeStyles(
          styles.container,
          this.interactionStateIsActive() && styles.active
        )}
        className="Card">
          <a
            {...this.trackInteractionStateActive()}
            style={styles.content}
            className="Card-content DocumentPreview DocumentPreview-excerpt"
            href={href}
            dangerouslySetInnerHTML={{__html: html}}
          />
          <div className="Card-footer" style={styles.footer}>
            { more && <Icon icon="content" size={this.remCalc(12)} /> }
          </div>
      </div>
    );
  }
});

export default Card;
