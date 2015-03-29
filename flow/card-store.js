/*jshint esnext:true, browserify:true, unused:true, devel:true */
/*globals SpaceHorse*/
'use strict';

import {EventEmitter} from 'events';
import Persistence from './persistence';
import Dispatcher from './dispatcher';

let data = SpaceHorse.data;

// Fill the content property with this message until the content is fetched
data.cards.forEach(function(card) {
  card.content = "Loading...";
});

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
        console.log("New card created successfully");
      }).catch(function(e) {
        console.error(`Oops, there was an error creating card ${card.id}: ${e.msg}`);
      });

      CardStore.emit('change');
    },
    updateCard(payload) {
      let updatedCard = payload.action.card;
      let card = CardStore.getCard(updatedCard.id);
      card.content = updatedCard.content;

      CardStore.sync("update", card).then(function() {
        console.log("Card updated successfully");
      }).catch(function(e) {
        console.error(`Oops, there was an error updating card ${card.id}: ${e.msg}`);
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
