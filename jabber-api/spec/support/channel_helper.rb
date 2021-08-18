require 'faker'
require 'factory_bot_rails'

module ChannelHelpers
  def create_user
    FactoryBot.create(:user,
      email: Faker::Internet.email,
      password: Faker::Internet.password
    )
  end

  def create_channel
    FactoryBot.create(:channel,
        users: [create_user],
        title: Faker::Team.name,
        desc: Faker::Team.state
    )
  end

  def build_channel
    FactoryBot.build(:channel,
        users: [create_user],
        title: Faker::Team.name,
        desc: Faker::Team.state
    )
  end

  def build_channel_without_user
    FactoryBot.build(:channel,
      title: Faker::Team.name,
      desc: Faker::Team.state
    )
  end

  def build_channel_without_title
    FactoryBot.build(:channel,
        users: [create_user],
        desc: Faker::Team.state
    )
  end

  def build_channel_without_desc
    FactoryBot.build(:channel,
        users: [create_user],
        title: Faker::Team.name
    )
  end

end
