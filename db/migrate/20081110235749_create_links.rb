class CreateLinks < ActiveRecord::Migration
  def self.up
    create_table :links do |t|
      t.references :group
      t.string :name
      t.string :description
      t.string :link
      t.integer :position

      t.timestamps
    end
    add_index :links, :group_id
    add_index :links, :position
  end

  def self.down
    drop_table :links
  end
end
