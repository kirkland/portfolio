Portfolio = Ember.Application.create({
  ready: function() {

    var view = Ember.View.create({
      templateName: "quotes_table",
      addQuote: function() {
                  var input = $("#quoteInput");

                  var symbol = input.val()

                  Portfolio.quotesController.addQuote(Portfolio.Quote.create({symbol: symbol}));

                  input.val('');

                  return false;
                }
    });

    view.append();

    view.didInsertElement = function() {
      $("#quoteInput").focus();
    }

    Portfolio.quotesController.fetchFromDatabase();

    var i = 0;
    var intervalId = window.setInterval(function() {
      Portfolio.quotesController.updateQuotes();
    }, 5000);

  }
});

Portfolio.Quote = Ember.Object.extend({
  symbol: null,
  price: 0,
  quantity: 1,

  totalValue: function() {
    return this.get('price') * this.get('quantity');
  }.property('quantity', 'price'),

  row_class: function() {
    return "symbol_" + this.get("symbol").toLowerCase();
  }.property('price'),

  fetchPrice: function() {
    var self = this;

    $.get('/quote/' + self.symbol, function (data) {
      var newPrice = data;
      var oldPrice = self.get('price')

      self.set('price', newPrice);

      if ( newPrice > oldPrice  ){

        $("." + self.get('row_class')).effect("highlight", {color: "green"}, 1500);

      } else if ( newPrice < oldPrice ) {

        $("." + self.get('row_class')).effect("highlight", {color: "red"}, 1500);

      }

    });
  },

  toHash: function() {
              return { symbol: this.get('symbol'),
                       quantity: this.get('quantity') }
            }
});

Portfolio.quotesController = Ember.ArrayController.create({
  content: [],

  updateQuotes: function() {
    this.content.forEach(function(quote) {
      quote.fetchPrice();
    })
  },

  addQuote: function(newQuote) {

              var self = this;

              if ( null === newQuote.quantity ) {
                newQuote.set('quantity', 1);
              }

              newQuote.addObserver('quantity', function() {
                self.persistToDatabase();
              });

              newQuote.fetchPrice();
              this.addObject(newQuote);
              self.persistToDatabase();
            },

  totalValue: function() {
                return this.content.reduce(function(previousValue, item) {
                  return previousValue + item.get('totalValue');
                }, 0);
              }.property("@each.totalValue"),

  fetchFromDatabase: function() {
                       var self = this;

                       $.get('/portfolio', function (data) {
                         self.content.clear();
                         console.log(data.portfolio_data);
                         data.portfolio_data.forEach(function(datum) {
                           var q = Portfolio.Quote.create({symbol: datum.symbol, quantity: datum.quantity});
                           self.addQuote(q);
                         });
                       })
                     },

  persistToDatabase: function() {
                       var content = this.get('content').map(function(item, index, enumerable) {
                         return item.toHash();
                       });

                       var post_data = { version: 1,
                                         portfolio_data: content };

                       $.post('/update_portfolio', {data: JSON.stringify(post_data)}, function (data) {
                         console.log("data: ", data);
                       })
                     }
});
