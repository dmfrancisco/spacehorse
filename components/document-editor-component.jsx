/*jshint esnext:true, browserify:true, unused:true */
'use strict';

import React from 'react/addons';
import Platform from '../helpers/platform';
if (Platform.node) require('../helpers/fakedom');
import CodeMirror from 'codemirror';
import 'codemirror/mode/gfm/gfm';
import StylingMixin from '../helpers/styling-mixin';

let PureRenderMixin = React.addons.PureRenderMixin;

/*
 * Document Editor Component
 *
 * Simple codemirror editor with support for Markdown.
 */
let DocumentEditor = React.createClass({
  mixins: [StylingMixin, PureRenderMixin],
  propTypes: {
    value: React.PropTypes.string.isRequired,
    onSave: React.PropTypes.func.isRequired
  },
  getDefaultProps() {
    return {
      mode: "gfm",
      lineWrapping: true,
      viewportMargin: Infinity, // The amount of lines that are rendered
      theme: "spacehorse-bright"
    };
  },
  componentDidMount() {
    this.editor = CodeMirror.fromTextArea(this.refs.editor.getDOMNode(), this.props);
    this.editor.setOption("extraKeys", this.keyMap()); // Add extra key bindings
  },
  render() {
    let styles = {
      width: "100%",
      fontSize: this.remCalc(16),
      lineHeight: this.remCalc(26)
    };
    return (
      <div style={styles} className="DocumentEditor">
        <textarea
          ref="editor"
          value={this.props.value}
          readOnly={true}
        />
      </div>
    );
  },
  keyMap() {
    return {
      "Ctrl-S": this.save,
      "Cmd-S":  this.save,
      "Ctrl-B": this.bold,
      "Cmd-B":  this.bold,
      "Ctrl-I": this.italic,
      "Cmd-I":  this.italic,
      "Alt-Left": "goWordLeft", // Move cursor to the start of the previous word
      "Alt-Right": "goWordRight", // Move cursor to the end of the previous word
      "Cmd-Z": "undo", // Should not be necessary but fixes undo on OS X
      "Shift-Cmd-Z": "redo", // Should not be necessary but fixes redo on OS X
      "Cmd-A": "selectAll"
    };
  },
  bold() {
    let s = this.editor.getSelection();
    if (s.charAt(0) === "*" && s.charAt(s.length - 1 === "*")) {
      this.editor.replaceSelection(s.replace(/\*/g, ""));
    } else {
      this.editor.replaceSelection(`**${ s.replace(/\*/g, "") }**`);
    }
  },
  italic() {
    let s = this.editor.getSelection();
    if (s.charAt(0) === "_" && s.charAt(s.length - 1 === "_")) {
      this.editor.replaceSelection(s.replace(/_/g, ""));
    } else {
      this.editor.replaceSelection(`_${ s.replace(/_/g, "") }_`);
    }
  },
  save() {
    this.props.onSave(this.editor.getValue());
  }
});

export default DocumentEditor;
