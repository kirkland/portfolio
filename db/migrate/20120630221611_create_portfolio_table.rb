class CreatePortfolioTable < ActiveRecord::Migration
  def change
    create_table :portfolios do |t|
      t.string :user_id, :null => false, :unique => true
      t.text :portfolio_data

      t.timestamps
    end

    add_index :portfolios, :user_id
  end
end
