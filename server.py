import socket

if __name__ == '__main__':
    # Define the socket
    host = '127.0.0.1'
    port = 5000
    number_of_clients = int(input('Enter number of clients: '))

    serverSocket = socket.socket(socket.AF_NET, socket.SOCK_STREAM)
    serverSocket.bind((host, port))
    serverSocket.listen(number_of_clients)

    # Establish the connections
    connections = []
    print('Starting clients')
    for i in range(number_of_clients):
        connect = serverSocket.accept()
        connections.append(connect)
        print('Connected with client', i+1)

    file_number = 0
    idx = 0

    for connection in connections:
        # Receive the file information
        idx += 1
        data = connection[0].recv(1024).decode()

        if not data:
            continue

        # Creating the file accepted and writing new file
        filename = 'output' + str(file_number) + '.txt'
        file_number += 1
        file = open(filename, "w")
        while data:
            if not data:
                break
            else:
                file.write(data)
                data = connection[0].recv(1024).decode()

        print('\nReceiving file from the client', idx)
        print('\nReceived successfully! New filename is:', filename)
        file.close()

    # Close all the open connections
    for connection in connections:
        connection[0].close()
