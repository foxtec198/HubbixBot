telefone = '4391076603'
if len(telefone) == 10:
    ddd = telefone[0:2]
    tel = telefone[2:]
    telefone = ddd + '9' + tel
print(telefone)