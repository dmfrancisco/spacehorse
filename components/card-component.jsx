/*jshint esnext:true, browserify:true, unused:true */
'use strict';

import React from 'react';
import Markdown from '../helpers/markdown';
import StylingMixin from '../helpers/styling-mixin';

/*
 * Card Component
 */
let Card = React.createClass({
  mixins: [StylingMixin],
  propTypes: {
    id: React.PropTypes.string.isRequired,
    boardId: React.PropTypes.string.isRequired,
    headerHeight: React.PropTypes.string.isRequired
  },
  render() {
    let styles = {
      container: {
        overflow: "hidden"
      },
      content: {
        background: "white",
        boxSizing: "border-box",
        color: "inherit",
        display: "block",
        fontSize: this.remCalc(14),
        maxHeight: this.remCalc(290),
        minHeight: this.remCalc(60),
        overflow: "hidden",
        padding: this.remCalc(10),
        textDecoration: "none",
        width: "100%"
      },
      after: {
        // It makes more sense to use a gradient background on an element
        // with position absolute. The problem is that adding position relative
        // to elements inside -webkit-columns is very buggy.
        outline: `${this.remCalc(10)} solid rgba(255,255,255,.8)`
      }
    };

    let content = this.props.children;
    let renderedContent = Markdown.renderExcerpt(content);
    let href = `/boards/${this.props.boardId}/cards/${this.props.id}`;

    return (
      <div className="Card" style={styles.container}>
        <a
          className="Card-content Document Document-excerpt"
          style={styles.content}
          href={href}
          dangerouslySetInnerHTML={{__html: renderedContent}}
        />
        <div className="Card-after" style={styles.after} />
      </div>
    );
  }
});

export default Card;
