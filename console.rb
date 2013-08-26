require 'oauth'
require 'pry'

key = 'dj0yJmk9YURpalc4UFpDOFAwJmQ9WVdrOWRGQjNNWEY2TlRZbWNHbzlNVGc0TlRRME56QTJNZy0tJnM9Y29uc3VtZXJzZWNyZXQmeD1mZA--'
secret = '40acbabb364b6d11b3a1159cfa27db39e2ca9fdc'

consumer = OAuth::Consumer.new(key, secret,
  :site => 'https://api.login.yahoo.com',
  :request_token_path => '/oauth/v2/get_request_token',
  :access_token_path => '/oauth/v2/get_token',
  :authorize_path => '/oauth/v2/request_auth',
  :signature_method => 'HMAC-SHA1',
  :oauth_version => '1.0')

binding.pry
