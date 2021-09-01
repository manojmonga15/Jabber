class Channel < ApplicationRecord
  has_many :memberships
  has_many :users, through: :memberships
  belongs_to :owner, class_name: 'User', foreign_key: :created_by
  has_many :messages, as: :messageable

  validates :title, presence: true
end
