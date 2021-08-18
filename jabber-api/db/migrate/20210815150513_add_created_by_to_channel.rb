class AddCreatedByToChannel < ActiveRecord::Migration[6.1]
  def change
    add_column :channels, :created_by, :integer
  end
end
