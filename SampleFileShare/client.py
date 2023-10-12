import socket

if __name__ == "__main__":
    host = '127.0.0.1'
    port = 5000

    socketClient = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    # Connect to the server
    socketClient.connect((host, port))

    while True:
        filename = input('Input the filename you want to send: ')

        if (filename.lower() == 'exit'):
            print("Exiting...")
            break

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
            print('You entered an invalid filename!\nPlease enter a valid name')

    socketClient.shutdown(socket.SHUT_WR)
    socketClient.close()
