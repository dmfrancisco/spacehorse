/*jshint esnext:true, browserify:true, unused:true */
'use strict';

import React from 'react';
import RoutingMixin from '../helpers/routing-mixin';
import BoardWrapper from './board-wrapper-component.jsx';

/*
 * Router Component
 *
 * Decides which components should be rendered by listening to changes in the url
 */
let Router = React.createClass({
  mixins: [RoutingMixin],
  propTypes: {
    startUrl: React.PropTypes.string
  },
  getDefaultProps() {
    return {
      startUrl: "/"
    };
  },
  getInitialState() {
    return {
      url: this.props.startUrl
    };
  },
  componentDidMount() {
    this.registerRoutingListeners();
  },
  onRouteChange(url) {
    this.setState({ url });
  },
  render() {
    let url = this.state.url, params = {};

    switch (true) {
      // Show a specific board
      case this.matchesRoute('/boards/:boardId', url, params):
        return (
          <BoardWrapper key={params.boardId} currentBoardId={params.boardId}/>
        );
      default:
        return <h1>Page not found</h1>;
    }
  }
});

export default Router;
