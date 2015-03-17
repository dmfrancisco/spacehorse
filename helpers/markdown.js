/*jshint esnext:true, browserify:true, unused:true */
'use strict';

import MarkdownIt from 'markdown-it';
import MarkdownEmoji from 'markdown-it-emoji';
import Twemoji from 'twemoji';
import Highlight from 'highlight.js';
import Platform from './platform';
import truncate from 'html-truncate';

/*
 * Markdown
 *
 * Wrapper around the MarkdownIt package that configures syntax highlighting
 * and twemoji support.
 */
let Markdown = {
  render(content) {
    let markdown = this._init();

    // Overwrite the existing function
    this.render = function(content) {
      return markdown.render(content);
    };
    // Call the new function
    return this.render(content);
  },
  // Renders only the first lines of the document and ignores images and links
  renderExcerpt(content, options = { length: 700 }) {
    let markdown = this._init();
    let rules = markdown.renderer.rules;

    let emptyRule = function(/*tokens, idx, options, env, self*/) {
      return "";
    };

    // Don't render images
    rules.image = emptyRule;

    // Display links as text
    rules.link_open = emptyRule;
    rules.link_close = emptyRule;

    // Overwrite the existing function
    this.renderExcerpt = function(content, options = { length: 600 }) {
      // TODO Avoid rendering the entire document
      var renderedContent = markdown.render(content);
      return truncate(renderedContent, options.length, { keepImageTag: true });
    };
    // Call the new function
    return this.renderExcerpt(content, options);
  },
  _init() {
    let markdown = new MarkdownIt({
      html: true, // Enable HTML tags in source (doesn't protect output from XSS)
      breaks: true, // GitHub Flavored Markdown line breaks (converts \n into <br>)
      linkify: true, // Autoconvert URL-like text to links
      typographer: true, // Enable some language-neutral replacement and smartquotes
      highlight: this._highlight
    });

    // Render emoji codes and unicode characters
    markdown.use(MarkdownEmoji);

    // Use Twemoji. Remove this line for native emoji
    markdown.renderer.rules.emoji = (token, idx) => {
      return Twemoji.parse(token[idx].content, this._twemojiOptions);
    };

    return markdown;
  },
  // Apply syntax highlighting to fenced code blocks
  _highlight(code, lang) {
    if (lang && Highlight.getLanguage(lang)) {
      try {
        return Highlight.highlight(lang, code).value;
      } catch (err) {}
    }
    try {
      return Highlight.highlightAuto(code).value;
    } catch (err) {}

    return ''; // Use external default escaping
  },
  // Use official CDN for browser & local SVGs for desktop app for offline support
  _twemojiOptions: Platform.nw ? {
    base: "/resources/",
    folder: "twemoji",
    ext: ".svg"
  } : {},

};

export default Markdown;
