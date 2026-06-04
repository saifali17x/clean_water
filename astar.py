graph = {
    'Tank A - Gulberg':    {'Tank B - DHA': 3.2, 'Tank C - Johar Town': 2.5},
    'Tank B - DHA':        {'Tank D - Model Town': 4.1},
    'Tank C - Johar Town': {'Tank D - Model Town': 2.8, 'Tank E - Cantt': 5.1},
    'Tank D - Model Town': {'Tank F - Bahria Town': 6.2},
    'Tank E - Cantt':      {'Tank F - Bahria Town': 4.3},
    'Tank F - Bahria Town': {}
}

Heuristic = {
    'Tank A - Gulberg':    9.5,
    'Tank B - DHA':        7.2,
    'Tank C - Johar Town': 6.8,
    'Tank D - Model Town': 6.2,
    'Tank E - Cantt':      4.3,
    'Tank F - Bahria Town': 0.0
}

def A_star(startingNode, goal, myGraph):
    cost  = 0
    path  = [startingNode]
    visited = []
    queue = [cost, path]

    while queue:
        index    = 0
        minIndex = 0

        while index < len(queue):
            currentNode = Heuristic[queue[minIndex + 1][-1]] + queue[minIndex]
            nextNode    = Heuristic[queue[index + 1][-1]]    + queue[index]

            if currentNode > nextNode:
                minIndex = index
            index = index + 2

        cost         = queue.pop(minIndex)
        path         = queue.pop(minIndex)
        last_visited = path[-1]

        if last_visited not in visited:
            visited.append(last_visited)

        if last_visited == goal:
            path.append(round(cost, 2))
            return path

        for child in myGraph[last_visited].keys():
            newPath = list(path)
            newPath.append(child)
            queue.append(cost + myGraph[last_visited][child])
            queue.append(newPath)

    return None
