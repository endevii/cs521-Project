import socket
import sys

if __name__ == "__main__":
    host = '127.0.0.1'
    port = 5000

    serverSocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    # while True:
    # try:
    serverSocket.bind((host, port))
    # except:
    #     port += 50
    # finally:
    #     exit
    serverSocket.listen(1)

    file_number = 0
    idx = 0
    user = 0
    connections = {}
    while True:
        connSocket, addr = serverSocket.accept()
        connections[connSocket] = addr
        print('Connected with client', user+1)
        for c in connections.keys():
            print(str(c), "-->", str(connections[c]))
        # print(str(connections))

        value = ""
        try:
            if (connSocket):
                value = connSocket.recv(1024).decode()
            if value:
                if (value == 'clients'):
                    print("Sending clients to", addr)
                    try:
                        connSocket.send(str(connections).encode())
                        print('Done sending clients...')
                    except:
                        print("Could not send clients list.")
                elif (value == 'done'):
                    print("Removing client", addr)
                    del connections[connSocket]
                    for c in connections.keys():
                        print(str(c), "-->", str(connections[c]))
                    conSocket.send('Success'.encode())
                    connSocket.close()
                elif (value == 'close'):
                    print("Closing server due to", addr)
                    serverSocket.close()
                    break
                else:
                    # Receive the file information
                    idx += 1

                    if not value:
                        continue

                    # Creating the file accepted and writing new file
                    filename = 'output' + str(file_number) + '.txt'
                    file_number += 1
                    file = open(filename, "w")
                    while value:
                        if not value:
                            break
                        else:
                            file.write(value)
                            value = connSocket.recv(1024).decode()

                    print('\nReceiving file from the client', idx)
                    print('\nReceived successfully! New filename is:', filename)
                    file.close()
        except Exception as err:
            print(f"{err}: closing server")
            # serverSocket.shutdown(socket.SHUT_WR)
            serverSocket.close()
            break
        # except:
        #     print("error")
        #     serverSocket.shutdown(socket.SHUT_WR)
        #     serverSocket.close()
        #     break
        user += 1
