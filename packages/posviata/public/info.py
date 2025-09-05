def item(title, text):
  return f'\033[0;90m> \033[0m\033[0;33m{title}: \033[0m\033[0;37m{text}\033[0m' 

print(item('Дата', '20 вересня'))
print(item('Час', '12:00'))
print(item('Де', 'ВДНГ'))
print(item('Ціна', '250'))
