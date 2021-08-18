class RenameColumnInJwtDenyList < ActiveRecord::Migration[6.1]
  change_table :jwt_denylist do |t|
    t.rename :expired_at, :exp
  end
end
