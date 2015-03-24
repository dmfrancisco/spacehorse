/*jshint esnext:true, browserify:true, unused:true */
'use strict';

import React from 'react/addons';

/*
 * Scroller Component
 *
 * Component that can be used to manipulate scroll position (based on goo.gl/9BkKDQ).
 * Available modes (set it with the `position` property):
 * - Same:        The user will be given the impression his scroll position
 *                didn't change, even if content was added above the fold;
 * - Top:         Scroll to the top;
 * - Smooth top:  Smoothly scroll to the top (with an animation);
 * - Bottom:      Scroll to the bottom;
 * - Stay bottom: The scroll position remains the same, which can be unexpected
 *                for the user, if new content was added above the fold.
 */
let Scroller = React.createClass({
  propTypes: {
    // A simple id that can be used for CSS
    id: React.PropTypes.string,
    // The position to where to scroll
    position: React.PropTypes.oneOf(
      ['same', 'top', 'smooth-top', 'bottom', 'stay-bottom']
    ).isRequired,
  },
  getDefaultProps() {
    return {
      position: "same"
    };
  },
  componentDidMount() {
    let node = this.getDOMNode();
    this._resetComponentScroll();
    node.addEventListener("mousewheel", this._onScroll);
  },
  componentWillUnmount() {
    let node = this.getDOMNode();
    node.removeListener("mousewheel", this._onScroll);
  },
  componentWillUpdate() {
    let node = this.getDOMNode();

    // Store the current scroll position
    this.scrollHeight = node.scrollHeight;
    this.scrollTop = node.scrollTop;
    this.isAtBottom = node.scrollTop + node.offsetHeight === node.scrollHeight;
  },
  componentDidUpdate() {
    let node = this.getDOMNode();
    let componentScroll = this._resetComponentScroll();

    switch (this.props.position) {
      // The user will be given the impression his scroll position didn't
      // change, even if content was added above the fold
      case "same":
        // Scroll to the added delta
        node.scrollTop = this.scrollTop + (node.scrollHeight - this.scrollHeight);
        break;
      // Scroll to the top
      case "top":
        node.scrollTop = 0;
        break;
      // Smoothly scroll to the top
      case "smooth-top":
        let samePos = this.scrollTop + (node.scrollHeight - this.scrollHeight);

        let animate = () => {
          // Stop If we are already on top or the user started scrolling
          if (node.scrollTop === 0 || componentScroll.userScrolling) {
            node.style.opacity = 1;
            return;
          }
          window.requestAnimationFrame(animate);
          node.scrollTop = this._lazyEase(node.scrollTop, 0, 2);
          node.style.opacity = this._lazyEase(node.style.opacity, 1, 2);
        };

        // Start near the top (this is a matter of preference)
        node.scrollTop = Math.min(samePos, 200);
        node.style.opacity = 0;

        animate();
        break;
      // Scroll to the bottom
      case "bottom":
        node.scrollTop = node.scrollHeight;
        break;
      // Scroll to the bottom if user is already at the bottom
      case "stay-bottom":
        if (this.isAtBottom) node.scrollTop = node.scrollHeight;
        break;
      // The scroll position remains the same, which can be unexpected for
      // the user, if new content was added above the fold.
      default:
    }
  },
  // Resets previously stored information about user scrolling
  _resetComponentScroll() {
    this.componentScroll = { userScrolling: false };
    return this.componentScroll;
  },
  // Records if the user has scrolled manually
  _onScroll() {
    this.componentScroll.userScrolling = true;
  },
  // Simple lazy animation (goo.gl/0Cl4vn)
  _lazyEase(now, end, speed) {
    return now + (end - now) / speed;
  },
  render() {
    return (
      <div id={this.props.id}>
        {this.props.children}
      </div>
    );
  }
});

export default Scroller;
