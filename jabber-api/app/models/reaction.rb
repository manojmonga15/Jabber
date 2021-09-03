class Reaction < ApplicationRecord
  belongs_to :message
  belongs_to :user

  scope :grouped_count,
        -> {
              joins(:user)
              .select("reactions.emoji, reactions.message_id, COUNT(reactions.emoji) as count,
                STRING_AGG(users.id || ',' || users.name, ';') as users")
              .group('reactions.emoji, reactions.message_id')
            }

  # after_create_commit do
  #
  # end

  after_commit :broadcast_response, on: [:create, :destroy]

  private
  def broadcast_response
    reactions = []

    message.reaction_counts.each do |react|
      reactions << {
          id: react.message_id.to_s + '_' + react.emoji,
          type: "reactions",
          attributes: {
            emoji: react.emoji,
            count: react.count,
            message_id: react.message_id,
            users: react.users
          }
        }
    end

    ActionCable.server.broadcast "message-#{message_id}:reactions", reactions
  end
end
