require 'csv'
require 'json'
require 'pry'

File.open('data.csv', 'r') do |f|
  data = CSV.parse(f.read)

  binding.pry
  File.open('data.json', 'w') do |f2|
    f2.write(data.to_json)
  end
end
