class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist

  has_many :memberships
  has_many :channels, through: :memberships
  has_many :owned_channels, class_name: 'Channel', foreign_key: :created_by
  has_many :messages, dependent: :destroy
  has_many :reactions, dependent: :destroy
  has_one_attached :avatar
end
