class Channel < ApplicationRecord
  has_many :memberships
  has_many :users, through: :memberships
  belongs_to :owner, class_name: 'User', foreign_key: :created_by
  has_many :messages, as: :messageable

  scope :public_channels, -> {where(private: false)}

  validates :title, presence: true

  after_create_commit :add_all_users, if: -> { !self.private? }

  private
  def add_all_users
    self.users = User.all
    self.save
  end
end
