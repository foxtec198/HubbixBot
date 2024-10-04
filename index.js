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

// Grupo de Demandas
const grupo = '120363347815836895@g.us'

function zerar(){
    tf = null
    nm = null
    cr = null
    rl = null
    bv = null
}

client.on('message_create', async message =>{
    // Confirma se é de Grupo (Total de 23 numeros) ou Privado (Total 17 numeros contando o @c.us)
    if(message.from.length === 17){ 
        // Confirma se existe mensagem, se nao foi enviada pelo bot e se nao feita as boas vindas!
        if(message.body && !message.fromMe && !bv){
            message.reply("Olá seja bem vindo(a), Sou o CNS e estarei te atendendo!\nSelecione abaixo uma das opções que mais te atende!\n1 - Problema de Comunicação\n\n_Para encerrar o atendimento digite *sair* á qualquer momento_")
            bv = true
            client.on('message_create', msgT=>{
                // Confirma se existe mensagem, se nao foi enviada pelo bot
                if(msgT && !msgT.fromMe){
                    // Confirma a opção da mensagem, se nao foi enviada pelo bot, a verificação de boasvindas e de nome da tarefa (false)
                    if(msgT.body === '1' && !msgT.fromMe && bv && !tf){
                        msgT.reply('Perfeito, agora digite seu primeiro nome!')
                        const nomeTarefa = 'Falha de Comunicação' //Seta o nome da tarefa, usado posteriormente
                        tf = true
                        client.on('message_create', msgN => {
                            if(!nm && bv && tf && msgN.body.length > 3 && !msgN.fromMe){
                                const nome = msgN.body
                                const telefone = msgN.from
                                nm = true
                                msgN.reply(`Okay, ${nome}.\nDe qual unidade estamos falando?`)
                                client.on('message_create', msgC => {
                                    if(!cr && bv && tf && nm && msgC.body.length >= 5 && !msgC.fromMe){
                                        const unidade = msgC.body
                                        cr = true
                                        msgC.reply(`Agora preciso que realize um breve relato sobre seu problema ${nome}, para que eu possa abrir um chamado para seu atendimento! \nEste relato será interno entre Gerente Regional somente, para que seja feito a tratativa seja completo nas informações, isso me ajudará.\n\n _Lembre-se, para abortar basta digitar *sair*!_`)
                                        client.on('message_create', msgR => {
                                            if(!rl && bv && tf && nm && cr && msgR.body.length >= 20 && !msgR.fromMe){
                                                const relato = msgR.body
                                                client.sendMessage(telefone, `Prezado(a) ${nome}. É um prazer lhe atender, Informo que seu chamado foi aberto e direcionado ao Gerente Regional para a tratativa, pedimos desculpas desde já, e podemos garantir que estamos trabalhando na melhora do atendimento e na comunicação! \n\nAtenciosamente \n\n*CNS* 🤖 - _©️ Desenvolvido por Guilherme Breve 2024_`)
                                                client.sendMessage(grupo, `*Novo Chamado* - ${unidade} 🏛️
🧑🏻 Solicitante: ${nome}
📞 Telefone: ${telefone.replace('@c.us','')}
🅰️ Tipo de Chamado: ${nomeTarefa}
🔓 Relato: ${relato}

Prezados, segue relato do cliente que abriu um chamado pelo atendimento ao cliente interno, peço que tenham compreensão e tratem o caso da melhor maneira. 💫🌟`)
                                                zerar()
                                                // Abrir chamado
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
            client.sendMessage(message.from, 'Até mais, sempre que precisar me aciona aqui 🤖❤️')
            zerar()
        }
    }
})

// Inicializa o cliet do bot
client.initialize();
