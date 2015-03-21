/*jshint esnext:true, browserify:true, unused:true */
'use strict';

import React from 'react';
import Markdown from '../helpers/markdown';
import CardStore from '../flow/card-store';

/*
 * Document Component
 */
export default React.createClass({
  propTypes: {
    cardId: React.PropTypes.string.isRequired
  },
  componentDidUpdate: function() {
    // Scroll to top
    document.getElementById("container").scrollTop = 0;
  },
  render() {
    let card = CardStore.getCard(this.props.cardId);
    let renderedContent = Markdown.render(card.content);

    return (
      <div id="document"
        className="Document Document-default"
        dangerouslySetInnerHTML={{__html: renderedContent}}
      />
    );
  }
});
