Portfolio = Ember.Application.create({
  ready: function() {
         }
});

Portfolio.Quote = Ember.Object.extend({
  symbol: null,
  price: null,

  fetchPrice: function() {
    var self = this;

    console.log('/quote/' + self.symbol);
    $.get('/quote/' + self.symbol, function (data) {
      self.set('price', data);
    });
  }
});

Portfolio.quotesController = Ember.ArrayController.create({
  content: [
    Portfolio.Quote.create({ 'symbol': 'AAPL', 'price': 500.00}),
    Portfolio.Quote.create({ 'symbol': 'VTI',  'price': 75.00})
  ]
});
