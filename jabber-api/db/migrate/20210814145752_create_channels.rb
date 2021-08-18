class CreateChannels < ActiveRecord::Migration[6.1]
  def change
    create_table :channels do |t|
      t.string :title, null:false
      t.string :desc
      t.boolean :private, default: false

      t.timestamps
    end
  end
end
