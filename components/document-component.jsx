/*jshint esnext:true, browserify:true, unused:true */
'use strict';

import React from 'react/addons';
import Markdown from '../helpers/markdown';
import CardStore from '../flow/card-store';

let PureRenderMixin = React.addons.PureRenderMixin;

/*
 * Document Component
 */
export default React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    cardId: React.PropTypes.string.isRequired
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
