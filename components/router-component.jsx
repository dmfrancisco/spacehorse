/*jshint esnext:true, browserify:true, unused:true */
'use strict';

import React from 'react/addons';
import ConfigStore from '../flow/config-store';
import RoutingMixin from '../helpers/routing-mixin';
import BoardWrapper from './board-wrapper-component.jsx';
import Scroller from './scroller-component.jsx';
import Document from './document-component.jsx';

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
      url: this.props.startUrl,
      config: this._getConfigFromStore()
    };
  },
  componentWillMount() {
    ConfigStore.addListener("change", this._onStoreChange);
  },
  componentWillUnmount() {
    ConfigStore.removeListener("change", this._onStoreChange);
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
      // Show a specific card and board
      case this.matchesRoute('/boards/:boardId/cards/:cardId', url, params):
        return (
          <Scroller id="container" position="smooth-top">
            <Document
              key={params.cardId}
              cardId={params.cardId}
            />
            <BoardWrapper
              key={params.boardId}
              currentBoardId={params.boardId}
              appName={this.state.config.appName}
            />
          </Scroller>
        );
      // Show a specific board
      case this.matchesRoute('/boards/:boardId', url, params):
        return (
          <Scroller id="container">
            <BoardWrapper
              key={params.boardId}
              currentBoardId={params.boardId}
              appName={this.state.config.appName}
            />
          </Scroller>
        );
      default:
        return <h1>Page not found</h1>;
    }
  },
  _onStoreChange() {
    this.setState({ config: this._getConfigFromStore() });
  },
  _getConfigFromStore() {
    return ConfigStore.getAll();
  }
});

export default Router;
