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
  render() {
    let styles = {
      container: {
        background: "white",
        boxSizing: "border-box",
        maxHeight: this.remCalc(290),
        minHeight: this.remCalc(60),
        overflow: "hidden",
        padding: this.remCalc(10),
        position: "relative",
        width: "100%"
      },
      content: {
        fontSize: this.remCalc(14),
        overflow: "hidden"
      },
      after: {
        background: "linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1) 50%)",
        bottom: 0,
        height: this.remCalc(13),
        position: "absolute",
        left: 0,
        width: "100%"
      }
    };

    let content = this.props.children;
    let renderedContent = Markdown.renderExcerpt(content);

    return (
      <div className="Card" style={styles.container}>
        <div
          className="Document Document--excerpt"
          style={styles.content}
          dangerouslySetInnerHTML={{__html: renderedContent}} />
        <div className="Card-after" style={styles.after} />
      </div>
    );
  }
});

export default Card;
