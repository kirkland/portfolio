class CreatePortfolioTable < ActiveRecord::Migration
  def change
    create_table :portfolios do |t|
      t.string :user_id, :null => false, :unique => true

      t.timestamps
    end
  end
end
