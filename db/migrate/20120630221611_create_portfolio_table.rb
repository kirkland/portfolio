class CreatePortfolioTable < ActiveRecord::Migration
  def change
    create_table :portfolios do |t|
      t.string :user_id, :null => true, :unique => true
      t.string :session_id, :null => true, :unique => true
      t.text :portfolio_data

      t.timestamps
    end

    add_index :portfolios, :user_id
    add_index :portfolios, :session_id
  end
end
