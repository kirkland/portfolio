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

// Disabled until I can get this working smoothly.
//      $("#stocks_table").dragtable({
//        persistState: function() {
//                        Portfolio.quotesController.updateColumns();
//                      },
//
//        // When the dragtable plugin is in action, it appears to make a copy of the table, where the
//        // header row becomes a regular row, which is messing up our stripes. Need to switch the classes
//        // while we're dragging.
//        beforeStart: function() {
//                        $("#stocks_table").removeClass("table-striped").addClass("table-striped-even");
//                      },
//        afterStop: function() {
//                            console.log($("#stocks_table"));
//                            $("#stocks_table").addClass("table-striped").removeClass("table-striped-even");
//                            console.log($("#stocks_table"));
//                      }
//      });

      Portfolio.quotesController.updateColumns();
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

    $.get(APP_BASE + '/quote/' + self.symbol, function (data) {
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

  columns: [],

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

  removeQuote: function(event) {
                 var quote = event.context;
                 this.content.removeObject(quote);
                 this.persistToDatabase();
               },

  totalValue: function() {
                return this.content.reduce(function(previousValue, item) {
                  return previousValue + item.get('totalValue');
                }, 0);
              }.property("@each.totalValue"),

  updateColumns: function() {
                   var columns = $("#stocks_table tr th").map(function(idx, elt) {
                     return $(elt).attr("data-keyname");
                   })

                   this.set("columns", columns);

                   this.persistToDatabase();
                 },

  fetchFromDatabase: function() {
                       var self = this;

                       $.get('/portfolio', function (data) {
                         self.content.clear();
                         //console.log(data.portfolio_data);
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
                                         portfolio_data: content,
                                         columns: this.get("columns").toArray() };

                       $.post('/update_portfolio', {data: JSON.stringify(post_data)}, function (data) {
                         //console.log("data: ", data);
                       })
                     }
});
