class Message < ApplicationRecord
  belongs_to :author, class_name: 'User', foreign_key: :author_id
  belongs_to :messageable, polymorphic: true
  has_many :reactions, dependent: :destroy
  has_many :reaction_counts,
            -> {
                  joins(:user)
                  .select("reactions.emoji, reactions.message_id, COUNT(reactions.emoji) as count,
                    GROUP_CONCAT(users.id || ',' || users.name, ';') as users")
                  .group('reactions.emoji, reactions.message_id')
                },
            class_name: :Reaction

  validates :body, :author_id, :messageable_id, :messageable_type, presence: true

  after_create_commit do
    ActionCable.server.broadcast "chat-#{messageable_id}:messages", build_broadcast_response
  end

  private
  def build_broadcast_response
    {
      data: {
        id: id,
        type: "messages",
        attributes: {
          timestamp: updated_at.strftime("%m/%d/%Y %-I:%M %p"),
          body: body,
          messageable_id: messageable_id,
          messageable_type: messageable_type,
          author_name: author.name,
          author_avatar: author.image
        }
      }
    }
  end
end
