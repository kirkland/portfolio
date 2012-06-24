Portfolio = Ember.Application.create({
  ready: function() {

    // Form to add a symbol to our portfolio.
    $('#symbol_input_form').submit(function() {
      var symbol = $('#symbol').val();
      var newQuote = Portfolio.Quote.create({'symbol': symbol, 'price': 0});

      Portfolio.quotesController.addObject(newQuote);
      newQuote.fetchPrice();

      return false;
    });

    var view = Ember.View.create({
      tagName: 'table',
      templateName: 'quote-row',
      symbol: 'VTI',
      price: 55.00
    });

    view.append();

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
