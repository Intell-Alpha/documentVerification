def nQueen(n, current, lst):
    # print(n, ' ', current, ' ', lst)
    if(current == (n-1)):
        for x in range(n):
            safe = isSafe(lst, (current, x), current)
            if(safe):
                lst[current]= (current,x)
                return (True, lst)
        return (False, lst)
    else:
        for m in range(n):
            safe = isSafe(lst, (current, m), current)
            # print(safe)
            lst[current] = (current, m)
            if(safe):
                tup = nQueen(n, current+1, lst)
                # print(tup)
                if(tup[0]):
                    if(current == 0):
                        print(tup[1])
                        # globalSolution.append(tup[1])
                        printBoard(tup[1])
                    else:
                        return (True, tup[1])
        return (False, None)
            


def isSafe(lst, cOrder, current):
    cnt = 0
    for i in lst:
        if(cnt == current):
            break
        if(i[0] == cOrder[0]):
            return False
        if(i[1] == cOrder[1]):
            return False
        if(i[0] + i[1] == cOrder[0] + cOrder[1]):
            return False
        if(i[0] - i[1] == cOrder[0] - cOrder[1]):
            return False
        cnt+=1
    return True

def printBoard(solution):
    # print(board)

    for n in range(len(board)):
        for m in range(len(board[n])):
            if((n,m) in solution):
                print('Q', end = " ")
            else:
                print('.', end = " ")
        print()
            


globalSolution = []


n = 10
if(n < 4):
    print("No solution exists")
    exit()
board = [[None] * n]*n

lst = [None] * n
nQueen(n, 0, lst)

# print(globalSolution)
# print(result)

# printBoard()
