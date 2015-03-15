/*jshint esnext:true, browserify:true, unused:true, devel:true */
'use strict';

import {EventEmitter} from 'events';
import Persistence from './persistence';
import Dispatcher from './dispatcher';
import data from '../seeds/data';

/*
 * Card Store
 */
let CardStore = Object.assign({}, EventEmitter.prototype, Persistence, {
  getCard(id) {
    return data.cards.find((el) => el.id == id);
  },
  getAll(listId) {
    return data.cards.filter((el) => el.listId == listId);
  }
});

CardStore.dispatchToken = Dispatcher.register(function(payload) {
  // Object with all supported actions by this store
  let actions = {
    createCard(payload) {
      let card = payload.action.card;
      data.cards.push(card);

      CardStore.sync("create", card).then(function() {
        console.log("New card saved successfully");
      }).catch(function(e) {
        console.error(`Oops, there was an error saving card ${card.id}: ${e.msg}`);
      });

      CardStore.emit('change');
    }
  };
  // If this action type is one of the supported, invoke it
  if (actions[payload.action.type]) actions[payload.action.type](payload);
});

// This is a temporary method that loads the content of all existing cards
CardStore.fetchContents = function() {
  this.sync("read").then((response) => {
    response.forEach(function(data) {
      let card = CardStore.getCard(data.id);
      if (card) Object.assign(card, data);
    });

    this.emit('change');

    console.log("All cards read successfully");
  }).catch(function(e) {
    console.error(`Oops, there was an error reading cards: ${e.msg}`);
  });
};

export default CardStore;
