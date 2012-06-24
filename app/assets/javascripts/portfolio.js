Portfolio = Ember.Application.create({
  ready: function() {

    var view = Ember.View.create({
      templateName: "quotes_table",
      addQuote: function() {
                  var symbol = $("#quoteInput").val()

                  Portfolio.quotesController.addQuote(symbol);

                  return false;
                }
    });

    view.append();

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

  // NOTE: Not used currently.
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
