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

    var outer = Portfolio.OuterView.create();
    outer.append();

    var view = Ember.View.create({
      templateName: 'this-view',
      do_something: function() {
        alert("nice");
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

    console.log('/quote/' + self.symbol);
    $.get('/quote/' + self.symbol, function (data) {
      self.set('price', data);
    });
  }
});

// TODO: Observe changes in content, and fetch price for last added.
Portfolio.quotesController = Ember.ArrayController.create({
  content: [],

  updateQuotes: function() {
    for (var i = 0; i < this.content.length; i++) {
      this.content[i].fetchPrice();
    }
  }
});



Portfolio.OuterView = Ember.View.extend({
  templateName: 'outer_view',
  firstName: 'Ricardo',
  lastName: 'Lebowki'
});

Portfolio.InnerView = Ember.View.extend({
  templateName: 'inner_view',
  color: 'red',
  politics: 'royalist'
});
