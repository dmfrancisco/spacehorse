/*jshint esnext:true, browserify:true, unused:true */
'use strict';

import React from 'react/addons';
import Platform from '../helpers/platform';
import CardStore from '../flow/card-store';
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
      previewMode: true
    };
  },
  renderDocument(content) {
    if (this.state.previewMode) {
      return <DocumentPreview content={content}/>;
    } else {
      return <DocumentEditor value={content}/>;
    }
  },
  componentWillMount() {
    if (!Platform.node) window.addEventListener("keydown", this.handleKeypress);
  },
  componentWillUnmount() {
    if (!Platform.node) window.removeEventListener("keydown", this.handleKeypress);
  },
  render() {
    let card = CardStore.getCard(this.props.cardId);

    let styles = {
      boxSizing: "border-box",
      margin: "0 auto",
      maxWidth: this.remCalc(700),
      minHeight: "100vh",
      padding: this.remCalc(80)
    };
    return (
      <div style={styles} onClick={this.handleClick}>
        {this.renderDocument(card.content)}
      </div>
    );
  },
  // If the person clicked on the content, switch to edit mode
  handleClick() {
    this.setState({ previewMode: false });
  },
  // If the user pressed ESC, switch to preview mode
  handleKeypress(e) {
    if (e.keyCode === 27) {
      this.setState({ previewMode: true });
    }
  }
});
