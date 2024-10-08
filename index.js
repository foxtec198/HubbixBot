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

// Steps - Passos
var bv = null
var tf = null
var nm = null
var cr = null
var rl = null
var nome = null
var user = null

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
}

function errMsg(msg, cdg){
    msg.reply(`Prezado(a), Estamos passando por problemas sistemicos, por gentileza tente novamente mais tarde, agradecemos seu contato! \n Código do Erro: ${cdg}`)
    zerar()
}

client.on('message_create', async msg =>{
    // Confirma se é de Grupo (Total de 23 numeros) ou Privado (Total 17 numeros contando o @c.us)
    if(msg.from.length === 17){ 
        // Confirma se existe mensagem, se nao foi enviada pelo bot e se nao feita as boas vindas!
        if(!bv && !tf && !nm && !cr && !rl && msg.body && !msg.fromMe && msg.body.toLowerCase() !== 'sair'){
            bv = "Olá seja bem vindo(a), Sou o CNS e estarei te atendendo!\nSelecione abaixo uma das opções que mais te atende!\n1 - Problema de Comunicação\n\n_Para encerrar o atendimento digite *sair* á qualquer momento._"
            msg.reply(bv)
            user = msg.from
        }
        // Confirma a opção da mensagem, se nao foi enviada pelo bot, a verificação de boasvindas e de nome da tarefa (false)
        else if(bv && !tf && !nm && !cr && !rl && msg.body === '1' && !msg.fromMe && user === msg.from){
            msg.reply('Perfeito, agora digite seu primeiro nome!')
            nomeTarefa = 'Falha de Comunicação' //Seta o nome da tarefa, usado posteriormente
            tf = true
        }
        else if(bv && tf && !nm && !cr && !rl && !nome && msg.body.length >= 3 && !msg.fromMe && user === msg.from){
            nome = msg.body
            nm = true
            msg.reply(`Okay, ${nome}.\nDe qual unidade estamos falando?`)
        }
        else if(bv && tf && nm && !cr && !rl && msg.body.length >= 5 && !msg.fromMe && user === msg.from){
            unidade = msg.body.toUpperCase()
            msg.reply(`Agora preciso que realize um breve relato sobre seu problema ${nome}, para que eu possa abrir um chamado para seu atendimento! \nEste relato será interno entre Gerente Regional somente, para que seja feito a tratativa seja completo nas informações, isso me ajudará.\n\n _Lembre-se, para abortar basta digitar *sair*!_`)
            cr = true
        }
        else if(bv && tf && nm && cr && !rl && msg.body.length >= 10 && !msg.fromMe && user === msg.from){
            telefone = msg.from
            relato = msg.body
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
    }
    else if(msg.body.toLowerCase() === 'sair' && !msg.fromMe){
        client.sendMessage(msg.from, 'Agradecemos seu contato, Até mais! \nSempre que precisar me aciona aqui.')
        zerar()
    }
})

// Inicializa o cliet do bot
client.initialize();
