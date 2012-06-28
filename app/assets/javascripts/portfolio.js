Portfolio = Ember.Application.create({
  ready: function() {

    var view = Ember.View.create({
      templateName: "quotes_table",
      addQuote: function() {
                  var input = $("#quoteInput");

                  var symbol = input.val()

                  Portfolio.quotesController.addQuote(symbol);

                  input.val('');

                  return false;
                }
    });

    view.append();

    view.didInsertElement = function() {
      $("#quoteInput").focus();
    }

    Portfolio.quotesController.addQuote('VTI');
    Portfolio.quotesController.addQuote('BND');
    Portfolio.quotesController.addQuote('AAPL');
    Portfolio.quotesController.addQuote('Z');

    var i = 0;
    var intervalId = window.setInterval(function() {
      Portfolio.quotesController.updateQuotes();
    }, 5000);

  }
});

Portfolio.Quote = Ember.Object.extend({
  symbol: null,
  price: null,

  fetchPrice: function() {
    var self = this;

    $.get('/quote/' + self.symbol, function (data) {
      self.set('price', data);
    });
  }
});

Portfolio.quotesController = Ember.ArrayController.create({
  content: [],

  updateQuotes: function() {
    this.content.forEach(function(quote) {
      quote.fetchPrice();
    })
  },

  addQuote: function(symbol) {

              var newQuote = Portfolio.Quote.create();

              newQuote.addObserver('symbol', function() {
                newQuote.fetchPrice();
              });

              newQuote.set('symbol', symbol);

              this.addObject(newQuote);
            }
});
