import socket
import sys

if __name__ == "__main__":
    host = '127.0.0.1'
    port = 5000

    socketClient = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    # Connect to the server
    socketClient.connect((host, port))

    connected = True

    while True:
        if connected == False:
            socketClient.connect((host, port))
        inp = input(
            'What command would you like: \nTo send file: send\nTo exit and finalize: exit\nTo get others on server: clients\n')

        if (inp.lower() == 'exit'):
            # send a close signal to server
            socketClient.send('done'.encode())
            res = socketClient.recv(1024).decode()
            print(res)
            print("Exiting...")
            break
        elif (inp.lower() == 'send'):
            filename = input('Input the filename you want to send: ')
            try:
                file = open(filename, 'r')
                data = file.read()
                if not data:
                    break
                while data:
                    socketClient.send(str(data).encode())
                    data = file.read()

                # Close the file after it has been sent
                file.close()
                socketClient.close()
            except:
                print('You entered an invalid filename!\nPlease enter a valid name!')
        elif (inp.lower() == 'send multi'):
            filename = input('Input the filename you want to send: ')
            try:
                file = open(filename, 'r')
                data = file.read()
                if not data:
                    break
                while data:
                    socketClient.send(str(data).encode())
                    data = file.read()

                # Close the file after it has been sent
                file.close()
            except:
                print('You entered an invalid filename!\nPlease enter a valid name!')
        elif (inp.lower() == 'clients'):
            socketClient.send('clients'.encode())
            try:
                data = socketClient.recv(1024).decode()
                connections = eval(str(data))
                print(connections)
            except:
                print('Could not get clients back.')
                continue
            # lst = data
            # for item in lst.keys():
            #     print(str(item))
        else:
            print('Please enter a valid command:\n')

    socketClient.shutdown(socket.SHUT_WR)
    socketClient.close()
