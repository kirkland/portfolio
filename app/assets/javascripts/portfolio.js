Portfolio = Ember.Application.create({
  ready: function() {
         }
});

Portfolio.Quote = Ember.Object.extend({
  symbol: null,
  price: null
});

Portfolio.quotesController = Ember.ArrayController.create({
  content: [
    Portfolio.Quote.create({ 'symbol': 'AAPL', 'price': 500.00}),
    Portfolio.Quote.create({ 'symbol': 'VTI',  'price': 75.00})
  ]
});
