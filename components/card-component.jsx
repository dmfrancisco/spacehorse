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
      background: "white",
      boxSizing: "border-box",
      minHeight: this.remCalc(60),
      padding: this.remCalc(10),
      width: "100%"
    };
    let content = this.props.children;
    let renderedContent = Markdown.render(content);

    return (
      <div
        className="Card"
        style={styles}
        dangerouslySetInnerHTML={{__html: renderedContent}}
      />
    );
  }
});

export default Card;
