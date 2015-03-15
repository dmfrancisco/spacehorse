/*jshint esnext:true, browserify:true, unused:true */
'use strict';

import Random from '../helpers/random';
import Dispatcher from './dispatcher';

/*
 * Card Actions
 */
let CardActions = {
  create: function({ listId, id, content }) {
    Dispatcher.handleViewAction({
      type: "createCard",
      card: {
        listId: listId,
        id: Random.id(),
        content: content
      }
    });
  }
};

export default CardActions;
