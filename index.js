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

// Grupo de Demandas
const grupo = '120363347815836895@g.us'
const grupo2 = 'CNS - Demandas 🤖🎖'

function zerar(){
    bv = null
    tf = null
    nm = null
    cr = null
    rl = null
    nome = null
}

function errMsg(telefone, nome){
    client.sendMessage(telefone, `Prezado(a) ${nome}. Estamos passando por problemas sistemicos, por gentileza tente novamente mais tarde, agradecemos seu contato!`)
    zerar()
}

client.on('message_create', async message =>{
    // Confirma se é de Grupo (Total de 23 numeros) ou Privado (Total 17 numeros contando o @c.us)
    if(message.from.length === 17){ 
        // Confirma se existe mensagem, se nao foi enviada pelo bot e se nao feita as boas vindas!
        if(message.body && !message.fromMe && !bv && message.body !== 'sair'){
            message.reply("Olá seja bem vindo(a), Sou o CNS e estarei te atendendo!\nSelecione abaixo uma das opções que mais te atende!\n1 - Problema de Comunicação\n\n_Para encerrar o atendimento digite *sair* á qualquer momento_")
            bv = true
            client.on('message_create', async msgT=>{
                // Confirma se existe mensagem, se nao foi enviada pelo bot
                if(msgT && !msgT.fromMe){
                    // Confirma a opção da mensagem, se nao foi enviada pelo bot, a verificação de boasvindas e de nome da tarefa (false)
                    if(msgT.body === '1' && !msgT.fromMe && bv && !tf){
                        msgT.reply('Perfeito, agora digite seu primeiro nome!')
                        const nomeTarefa = 'Falha de Comunicação' //Seta o nome da tarefa, usado posteriormente
                        tf = true
                        client.on('message_create', async msgN => {
                            if(!nm && bv && tf && !cr && !rl && msgN.body.length > 3 && !msgN.fromMe){
                                nome = msgN.body
                                const telefone = msgN.from
                                msgN.reply(`Okay, ${nome}.\nDe qual unidade estamos falando?`)
                                nm = true
                                client.on('message_create', async msgC => {
                                    if(!cr && bv && tf && nm && msgC.body.length >= 5 && !msgC.fromMe){
                                        const unidade = msgC.body
                                        cr = true
                                        msgC.reply(`Agora preciso que realize um breve relato sobre seu problema ${nome}, para que eu possa abrir um chamado para seu atendimento! \nEste relato será interno entre Gerente Regional somente, para que seja feito a tratativa seja completo nas informações, isso me ajudará.\n\n _Lembre-se, para abortar basta digitar *sair*!_`)
                                        client.on('message_create', async msgR => {
                                            if(!rl && bv && tf && nm && cr && msgR.body.length >= 10 && !msgR.fromMe){
                                                const relato = msgR.body
                                                try{
                                                    var telefoneContato = telefone.replace('55','')
                                                    telefoneContato = telefoneContato.replace('@c.us','')
                                                    fetch(`http://127.0.0.1:8971/abrir_chamado?tf=${nomeTarefa}&&nm=${nome}&&tel=${telefoneContato}&&cr=${unidade}&&rl=${relato}`, {method:'POST'})
                                                    .then(res=>{
                                                        if(res.status === 201){
                                                            msgR.reply(`Prezado(a) ${nome}. É um prazer lhe atender, Informo que seu chamado foi aberto e direcionado ao Gerente Regional para a tratativa, pedimos desculpas desde já, e podemos garantir que estamos trabalhando na melhora do atendimento e na comunicação! \n\nAtenciosamente \n\n*CNS* 🤖 - _©️ Desenvolvido por Guilherme Breve 2024_`)
                                                            client.sendMessage(grupo, `*Novo Chamado* - ${unidade} 🏛️
🧑🏻 *Solicitante:* ${nome}
📞 *Telefone:* ${telefoneContato}
🅰️ *Tipo de Chamado:* ${nomeTarefa}
🔓 *Relato:* ${relato}

-- Prezados, segue relato do cliente que abriu um chamado pelo atendimento ao cliente interno, peço que tenham compreensão e tratem o caso da melhor maneira. 💫🌟`)
                                                            zerar()
                                                        }else if(res.status === 500){
                                                            errMsg(telefone, nome)
                                                        }
                                                    })
                                                }catch{
                                                    errMsg(telefone, nome)
                                                }
                                            }
                                        })
                                    }
                                })
                            }
                        })
    
                    }
                }
            })
        }
        if(message.body.toLowerCase() === 'sair' && !message.fromMe){
            client.sendMessage(message.from, 'Agradecemos seu contato, Até mais! \nSempre que precisar me aciona aqui 🤖❤️')
            zerar()
        }
    }
})

// Inicializa o cliet do bot
client.initialize();
