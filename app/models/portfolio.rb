class Portfolio < ActiveRecord::Base
  serialize :portfolio_data, Hash
end
