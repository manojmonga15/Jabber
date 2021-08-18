class Channel < ApplicationRecord
  has_many :memberships
  has_many :users, through: :memberships
  belongs_to :owner, class: :User, foreign_key: :created_by

  validates :users, :title, presence: true
end
