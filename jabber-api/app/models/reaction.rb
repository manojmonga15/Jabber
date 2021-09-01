class Reaction < ApplicationRecord
  belongs_to :message
  belongs_to :user

  scope :grouped_count,
        -> {
              joins(:user)
              .select("reactions.emoji, reactions.message_id, COUNT(reactions.emoji) as count,
                GROUP_CONCAT(users.id || ',' || users.name, ';') as users")
              .group('reactions.emoji, reactions.message_id')
            }

  after_create_commit do
    ActionCable.server.broadcast "message-#{message_id}:reactions", build_broadcast_response
  end

  private
  def build_broadcast_response
    reactions = []
    puts message.reaction_counts

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
    reactions
  end
end
