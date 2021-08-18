class SerializableUser < JSONAPI::Serializable::Resource
  type 'users'

  attributes :email, :name, :image, :bio

  link :self do
    @url_helpers.api_v1_user_path(@object.id)
  end
end
