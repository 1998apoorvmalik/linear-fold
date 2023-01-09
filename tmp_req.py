import socket

def request_ironcreek_v(seqfile_prefix):
    s2 = socket.socket()         # creat socket object
    host = 'ironcreek.eecs.oregonstate.edu'
    port2 = 11118                # set port

    s2.connect((host, port2))
    #seqfile_prefix_s = bytes(seqfile_prefix,'UTF-8')
    s2.send(seqfile_prefix)
    t2 = s2.recv(1024)

    s2.close()

    return t2


if __name__ == '__main__':
    seqfile_prefix = '/nfs/stak/users/liukaib/public_html/usrData/test_ltf2'
    t = request_ironcreek_v(seqfile_prefix)
    print(t)
