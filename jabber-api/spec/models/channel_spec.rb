require 'rails_helper'

describe Channel, type: :model do
  let (:channel) {create_channel}
  let (:new_channel_without_user) {build_channel_without_user}


  context "when creating channel" do
    it 'ensures presence of user' do
      channel = build_channel_without_user.save
      expect(channel).to eq(false)
    end

    it 'ensures presence of title' do
      channel = build_channel_without_title.save
      expect(channel).to eq(false)
    end

    it 'does not validates presence of title' do
      channel = build_channel_without_desc.save
      expect(channel).to eq(true)
    end
  end
end
