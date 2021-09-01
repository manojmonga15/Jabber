class CreateMessages < ActiveRecord::Migration[6.1]
  def change
    create_table :messages do |t|
      t.text :body
      t.references :author, null: false
      t.string :messageable_type
      t.integer :messageable_id, null: false

      t.timestamps
    end
  end
end
