const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const client = new Client({authStrategy: new LocalAuth()});


// Se o login nao estiver o OK gera um QR para leitura e conexão!
client.on('qr', qr =>{
    qrcode.generate(qr, {small: true});
})

// Confere se o Login esta OK
client.on('ready', _ =>{
    console.log('Em execução!')
})

var bv = null
var user = null
var tf = null
var nm = null
var cr = null
var rl = null
var nome = null
var dash = null
var cd = null

// Dados da Opção - 1
var nome = ''
var telefone = ''
var unidade = ''
var nomeTarefa = ''

// Grupo de Demandas
var grupo = '120363347815836895@g.us'

function zerar(){
    bv = null
    tf = null
    nm = null
    cr = null
    rl = null
    nome = null
    user = null
    dash = null
    cd = null
}

function errMsg(msg, cdg){
    msg.reply(`Prezado(a), Estamos passando por problemas sistemicos, por gentileza tente novamente mais tarde, agradecemos seu contato! \n Código do Erro: ${cdg}`)
    zerar()
}

client.on('message_create', async msg =>{
    // Confirma se é de Grupo (Total de 23 numeros) ou Privado (Total 17 numeros contando o @c.us)
    if(msg.from.length === 17){ 
        // Boas Vindas
        // Confirma se existe mensagem, se nao foi enviada pelo bot e se nao feita as boas vindas!
        if(!bv && !tf && !nm && !cr && !rl && msg.body && !msg.fromMe && msg.body.toLowerCase() !== 'sair'){
            bv = "Olá seja bem vindo(a), Sou o CNS e estarei te atendendo!\nDigite um número que condiza com a opção abaixo que mais te atende!\n\n\n--------------------------------------- \n1 - Problema de Atendimento\n2 - Erro com Dashboard\n~3 - Problemas com o GPS Vista~\n~4 - Falar com um Atendente~\n\n_Para encerrar o atendimento digite *sair* á qualquer momento._"
            msg.reply(bv)
            user = msg.from
        }

        // OPÇÃO 1
        // Confirma a opção da mensagem, se nao foi enviada pelo bot, a verificação de boasvindas e de nome da tarefa (false)
        else if(bv && !tf && !nm && !cr && !rl && msg.body === '1' && !msg.fromMe && user === msg.from && msg.body.toLowerCase() !== 'sair'){
            client.sendMessage(msg.from, 'Falha de Comunicação Selecionado')
            msg.reply('Perfeito, agora digite seu primeiro nome!')
            nomeTarefa = 'Falha de Comunicação' //Seta o nome da tarefa, usado posteriormente
            tf = true
        }
        // Pega a Unidade do cliente!
        else if(bv && tf && !nm && !cr && !rl && !nome && msg.body.length >= 3 && !msg.fromMe && user === msg.from && msg.body.toLowerCase() !== 'sair'){
            nome = msg.body
            nm = true
            msg.reply(`Okay, ${nome}.\nDe qual unidade estamos falando?`)
        }
        // Criando Relato do Cliente
        else if(bv && tf && nm && !cr && !rl && msg.body.length >= 5 && !msg.fromMe && user === msg.from && msg.body.toLowerCase() !== 'sair'){
            unidade = msg.body.toUpperCase()
            msg.reply(`Agora preciso que realize um breve relato sobre seu problema ${nome}, para que eu possa abrir um chamado para seu atendimento! \nEste relato será interno entre Gerente Regional somente, para que seja feito a tratativa seja completo nas informações, isso me ajudará.\n\n _Lembre-se, para abortar basta digitar *sair*!_`)
            cr = true
        }
        // Confirmação dos dados antes de enviar
        else if(bv && tf && nm && cr && !rl && msg.body.length >= 10 && !msg.fromMe && user === msg.from && msg.body.toLowerCase() !== 'sair'){
            telefone = msg.from
            telefone = telefone.replace('55','')
            telefone = telefone.replace('@c.us','')
            relato = msg.body
            rl = `Ok vamos confirmar alguns dados. \nNome: ${nome}\nUnidade/CR: ${unidade}\nContato: ${telefone}\nTipo do Chamado: ${nomeTarefa}\nRelato: ${relato}\n\n\n\n-----------------------------------------\nDigite um número referente a opção selecionada!\n1 - Sim, Enviar\n2 - Não, Cancelar relato`
            msg.reply(rl)
        }
        // Caso o relato nao alcance o minimo desejado
        else if(bv && tf && nm && cr && !rl && msg.body.length < 10 && !msg.fromMe && user === msg.from && msg.body.toLowerCase() !== 'sair'){
            msg.reply('Relato não atingiu o minimo de 10 caracteres! \nSeja mais completo por favor!')
        }
        // Confirmação dos dados, envio da mensagem no grupo da Regional e Abertura de Chamado no VISTA
        else if(bv && tf && nm && cr && rl && msg.body === '1' && !msg.fromMe && user === msg.from && msg.body.toLowerCase() !== 'sair'){
            msg.reply('Aguarde um instante...')
            client.sendMessage(grupo, `*Novo Chamado* 🔊
🧑🏻 *Solicitante:* ${nome}
🏛️ *Unidade:* ${unidade}
📞 *Telefone:* ${telefone}
🅰️ *Tipo de Chamado:* ${nomeTarefa}
🔓 *Relato:* ${relato}

-- Prezados, segue relato do cliente que abriu um chamado pelo atendimento ao cliente interno, peço que tenham compreensão e tratem o caso da melhor maneira. 💫🌟`)
            fetch(`http://127.0.0.1:8971/abrir_chamado?tf=${nomeTarefa}&&nm=${nome}&&tel=${telefone}&&cr=${unidade}&&rl=${relato}`, {method:'POST'})
            .then(res=>{
                if(res.status === 201){
                    msg.reply(`Prezado(a) ${nome}. É um prazer lhe atender, Informo que seu chamado foi aberto e direcionado ao Gerente Regional para a tratativa, pedimos desculpas desde já, e podemos garantir que estamos trabalhando na melhora do atendimento e na comunicação! \n\nAtenciosamente \n\n*CNS* 🤖 - _©️ Desenvolvido por Guilherme Breve 2024_`)
                }else if(res.status === 500){
                    errMsg(msg, res.statusText)
                    zerar()
                }
            })
        }
        // Sair e descartar dados, não confirmação dos dados!
        else if(bv && tf && nm && cr && rl && msg.body === '2' && !msg.fromMe && user === msg.from && msg.body.toLowerCase() !== 'sair'){
            client.sendMessage(msg.from, 'Agradecemos seu contato, Até mais! \nSempre que precisar me aciona aqui.')
            zerar()
        }

        // OPÇÃO 2
        // Get Name
        else if(bv && !nm && !cr && !dash && !rl && !cd && msg.body === '2' && !msg.fromMe && user === msg.from && msg.body.toLowerCase() !== 'sair'){
            client.sendMessage(msg.from, 'Erro com Dashboard Selecionado')
            nm = 'Perfeito, agora digite seu primeiro nome!'
            nomeTarefa = 'Problemas com Dashboard'
            msg.reply(nm)
        }
        // Pega a Unidade
        else if(bv && nm && !cr && !dash && !rl && !cd && msg.body.length >= 3 && !msg.fromMe && user === msg.from && msg.body.toLowerCase() !== 'sair'){
            nome = msg.body
            cr = `Okay, ${nome}.\nDe qual unidade estamos falando?`
            msg.reply(cr)
        }
        // Pega o Link do Dashboard (CASO HAJA)
        else if(bv && nm && cr && !dash && !rl && !cd && msg.body.length >= 5 && !msg.fromMe && user === msg.from && msg.body.toLowerCase() !== 'sair'){
            unidade = msg.body.toUpperCase()
            dash = 'Digite o link do dashboard com problemas, se não souber digite a palavra *"NÃO"* '
            msg.reply(dash)
        }
        // Relato do Problema
        else if(bv && nm && cr && dash && !rl && !cd && !msg.fromMe && user === msg.from && msg.body.toLowerCase() === 'não' || msg.body.toLowerCase() === 'nao' && msg.body.toLowerCase() !== 'sair'){
            link = msg.body
            rl = "Preciso que detalhe o problema para auxiliar o tratamento do mesmo, Relate de forma direta e completa por favor."
            msg.reply(rl)
        }
        // Confirmação dos dados
        else if(bv && nm && cr && dash && rl && !cd && msg.body.length >= 10 && !msg.fromMe && user === msg.from && msg.body.toLowerCase() !== 'sair'){
            telefone = msg.from
            telefone = telefone.replace('55','')
            telefone = telefone.replace('@c.us','')
            relato = msg.body
            msg.reply(`Ok vamos confirmar alguns dados. \nNome: ${nome}\nUnidade/CR: ${unidade}\nContato: ${telefone}\nTipo do Chamado: ${nomeTarefa}\nRelato: ${relato}\n\n\n\n-----------------------------------------\nDigite um número referente a opção selecionada!\n1 - Sim, Enviar\n2 - Não, Cancelar relato`)
            cd = true
        }
        else if(bv && nm && cr && dash && rl && cd && msg.body === '1' && !msg.fromMe && user === msg.from && msg.body.toLowerCase() !== 'sair'){
            msg.reply('Aguarde um instante...')
            client.sendMessage(grupo, `*Novo Chamado* 🔊
🧑🏻 *Solicitante:* ${nome}
🏛️ *Unidade:* ${unidade}
📞 *Telefone:* ${telefone}
🅰️ *Tipo de Chamado:* ${nomeTarefa}
🔓 *Relato:* ${relato}

-- Prezados, segue relato do cliente que abriu um chamado pelo atendimento ao cliente interno, peço que tenham compreensão e tratem o caso da melhor maneira. 💫🌟`)
            fetch(`http://127.0.0.1:8971/abrir_chamado?tf=${nomeTarefa}&&nm=${nome}&&tel=${telefone}&&cr=${unidade}&&rl=${relato}`, {method:'POST'})
            .then(res=>{
                if(res.status === 201){
                    msg.reply(`Prezado(a) ${nome}. É um prazer lhe atender, Informo que seu chamado foi aberto e direcionado ao Gerente Regional para a tratativa, pedimos desculpas desde já, e podemos garantir que estamos trabalhando na melhora do atendimento e na comunicação! \n\nAtenciosamente \n\n*CNS* 🤖 - _©️ Desenvolvido por Guilherme Breve 2024_`)
                }else if(res.status === 500){
                    errMsg(msg, res.statusText)
                    zerar()
                }
            })
        }
        // Cancela o atendimento
        else if(bv && nm && cr && dash && rl && cd && msg.body === '2' && !msg.fromMe && user === msg.from && msg.body.toLowerCase() !== 'sair'){
            client.sendMessage(msg.from, 'Agradecemos seu contato, Até mais! \nSempre que precisar me aciona aqui.')
            zerar()
        }
        // Sair do atendimento - Zera e Inicia novamente
        else if(msg.body.toLowerCase() === 'sair' && !msg.fromMe){
            client.sendMessage(msg.from, 'Agradecemos seu contato, Até mais! \nSempre que precisar me aciona aqui.')
            zerar()
        }
    }
    // Sair do atendimento - Zera e Inicia novamente
    else if(msg.body.toLowerCase() === 'sair' && !msg.fromMe){
        client.sendMessage(msg.from, 'Agradecemos seu contato, Até mais! \nSempre que precisar me aciona aqui.')
        zerar()
    }
})

// Inicializa o cliet do bot
client.initialize();
