/*jshint esnext:true, browserify:true, unused:true */
'use strict';

import React from 'react/addons';
import Markdown from '../helpers/markdown';
import StylingMixin from '../helpers/styling-mixin';

let PureRenderMixin = React.addons.PureRenderMixin;

/*
 * Document Preview Component
 */
let DocumentPreview = React.createClass({
  mixins: [StylingMixin, PureRenderMixin],
  propTypes: {
    content: React.PropTypes.string.isRequired
  },
  render() {
    let renderedContent = Markdown.render(this.props.content);

    let styles = {
      fontSize: this.remCalc(19), // Change this to make everything smaller or larger
      lineHeight: this.remCalc(30)
    };
    return (
      <div
        style={styles}
        className="DocumentPreview DocumentPreview-default"
        dangerouslySetInnerHTML={{__html: renderedContent}}
      />
    );
  }
});

export default DocumentPreview;
