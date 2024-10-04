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

            if len(telefone) == 10:
                ddd = telefone[0:2]
                tel = telefone[2:]
                telefone = ddd + '9' + tel

            relato = request.args['rl']
            cr = request.args['cr']
            body = f"""Novo Atendimento* - {cr} 🏛️
🧑🏻 *Solicitante:* ${nome}
📞 *Telefone:* {telefone}
🅰️ *Tipo de Chamado:* {nomeChamado}
🔓 *Relato:* {relato}

-- Prezados, segue relato do cliente que abriu um chamado pelo atendimento ao cliente interno, peço que tenham compreensão e tratem o caso da melhor maneira. 💫🌟
"""
            
            chamado.abrir(nome, 'cns@cns.com', telefone, nomeChamado, body, 'Falha de Comunicação')
            return '', 201
        except Exception as err: return err, 500

if __name__ == '__main__':
    port = int(getenv('PORT', 8971))
    app.run('0.0.0.0', port, debug=False)
    