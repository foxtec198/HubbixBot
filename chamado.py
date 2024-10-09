import pyautogui as pg
from webbrowser import open_new
from time import sleep

link_chamado = 'https://portalprod.gpsvista.com.br/chamado/3013DE0D-E827-403C-B902-77F76B13CAB2'
pg.PAUSE = 1

def atalho(*keys):
    with pg.hold(keys[0]):
        pg.press(keys[1])

class Chamado:
    def abrir(self, nome, email, telefone, relato, tarefa):
        open_new(link_chamado)
        pg.click()
        sleep(5)
        pg.press('tab')
        pg.write(nome)
        pg.press('tab')
        pg.write(email)
        pg.press('tab')
        pg.write(telefone.strip('@c.us'))
        pg.press('tab')
        pg.write(tarefa)
        pg.press('tab')
        pg.press('space')
        pg.press('tab')
        pg.write(relato)
        pg.press('tab')
        pg.press('space')
        sleep(1)
        pg.write(tarefa)
        sleep(1)
        pg.press('enter')
        for i in range(3): pg.press('tab')
        pg.press('enter')
        atalho('ctrl','w')

if __name__ == '__main__':
    ch = Chamado()
    ch.abrir('Guilherme Barbosa Andre Breve','foxtec198@gmail.com','43996617904','Falha de Comunicação - WTSBot','Falha de Comunica')
