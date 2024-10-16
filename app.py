from flask import Flask, request
from chamado import Chamado
from os import getenv

app = Flask(__name__)
chamado = Chamado()

@app.route('/abrir_chamado', methods=['POST'])
def abrir_chamado():
    if request.method == 'POST':
        try:
            nomeChamado = request.args['tf']
            nome = request.args['nm']
            telefone = request.args['tel']

            telefone = telefone.replace('55','')
            telefone = telefone.replace('@c.us','')
            
            if len(telefone) == 10:
                ddd = telefone[0:2]
                tel = telefone[2:]
                telefone = ddd + '9' + tel

            relato = request.args['rl']
            cr = request.args['cr']
            body = f"""Novo Atendimento
--------------------------------------------------
Solicitante: {nome}
Telefone: {telefone}
Unidade: {cr}
Tipo de Chamado: {nomeChamado}
Relato: {relato}"""
            chamado.abrir(nome, 'cns@cns.com', telefone, body, nomeChamado)
            return '', 201
        except Exception as err: return err, 500

if __name__ == '__main__':
    port = int(getenv('PORT', 8971))
    app.run('0.0.0.0', port, debug=False)
    