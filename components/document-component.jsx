/*jshint esnext:true, browserify:true, unused:true */
'use strict';

import React from 'react/addons';
import Platform from '../helpers/platform';
import CardStore from '../flow/card-store';
import CardActions from '../flow/card-actions';
import StylingMixin from '../helpers/styling-mixin';
import DocumentPreview from './document-preview-component.jsx';
import DocumentEditor from './document-editor-component.jsx';

let PureRenderMixin = React.addons.PureRenderMixin;

/*
 * Document Component
 */
export default React.createClass({
  mixins: [StylingMixin, PureRenderMixin],
  propTypes: {
    cardId: React.PropTypes.string.isRequired
  },
  getInitialState() {
    return {
      previewMode: true,
      card: this._getStateFromStore()
    };
  },
  renderDocument(content) {
    if (this.state.previewMode) {
      return <DocumentPreview content={content}/>;
    } else {
      return <DocumentEditor value={content} onSave={this.handleSave}/>;
    }
  },
  componentWillMount() {
    CardStore.addListener("change", this._onStoreChange);
    if (!Platform.node) window.addEventListener("keydown", this.handleKeypress);
  },
  componentWillUnmount() {
    CardStore.removeListener("change", this._onStoreChange);
    if (!Platform.node) window.removeEventListener("keydown", this.handleKeypress);
  },
  render() {
    let content = this.state.card.content;

    let styles = {
      alignItems: "center",
      boxSizing: "border-box",
      display: "flex",
      justifyContent: "center",
      margin: "0 auto",
      maxWidth: this.remCalc(700),
      minHeight: "100vh",
      padding: this.remCalc(80, 80, 120)
    };
    return (
      <div style={styles} onClick={this.handleClick}>
        {this.renderDocument(content)}
      </div>
    );
  },
  // If the user clicked on the content, switch to edit mode
  handleClick(e) {
    // Return if the user clicked in a link
    if (e.target.nodeName === "A") return;

    this.setState({ previewMode: false });
  },
  // If the user pressed ESC, switch to preview mode
  handleKeypress(e) {
    if (e.keyCode === 27) {
      this.setState({ previewMode: true });
    }
  },
  // Save updates done to the document text
  handleSave(content) {
    if (content.trim() === "") return;

    CardActions.update({
      id: this.state.card.id,
      content: content
    });
  },
  _onStoreChange() {
    this.setState({ card: this._getStateFromStore() });
  },
  _getStateFromStore() {
    return CardStore.getCard(this.props.cardId);
  }
});
