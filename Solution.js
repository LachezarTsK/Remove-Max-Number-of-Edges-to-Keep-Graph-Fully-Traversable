
/**
 * @param {number} totalNodes
 * @param {number[][]} edges
 * @return {number}
 */
var maxNumEdgesToRemove = function (totalNodes, edges) {
    const GRAPH_IS_NOT_FULLY_TRAVERSABLE = -1;
    const EDGE_FOR_ALICE = 1;
    const EDGE_FOR_BOB = 2;
    const EDGE_FOR_BOTH_ALICE_AND_BOB = 3;

    const unionFindAlice = new UnionFind(totalNodes);
    const unionFindBob = new UnionFind(totalNodes);

    let minNumberOfEgesForFullyTraversableGraph
            = minNumberOfEdgesPerTypeOfEdge(EDGE_FOR_BOTH_ALICE_AND_BOB, unionFindAlice, unionFindBob, edges)
            + minNumberOfEdgesPerTypeOfEdge(EDGE_FOR_ALICE, unionFindAlice, null, edges)
            + minNumberOfEdgesPerTypeOfEdge(EDGE_FOR_BOB, null, unionFindBob, edges);

    return (unionFindAlice.graphIsFullyTraversable() && unionFindBob.graphIsFullyTraversable())
            ? edges.length - minNumberOfEgesForFullyTraversableGraph
            : GRAPH_IS_NOT_FULLY_TRAVERSABLE;

};

/**
 * @param {number} edgeType
 * @param {UnionFind} unionFindAlice
 * @param {UnionFind} unionFindBob  
 * @param {number[][]} edges
 * @return {number}
 */
function minNumberOfEdgesPerTypeOfEdge(edgeType, unionFindAlice, unionFindBob, edges) {
    let minNumberOfEdges = 0;
    let value = (unionFind, edgeOne, edgeTwo) => (unionFind !== null) ? unionFind.joinByRank(edgeOne, edgeTwo) : 1;
    for (let edge of edges) {
        if (edge[0] === edgeType) {
            minNumberOfEdges += value(unionFindAlice, edge[1], edge[2]) & value(unionFindBob, edge[1], edge[2]);
        }
    }
    return minNumberOfEdges;
}



class UnionFind {

    static NEW_UNION = 1;
    static NOT_NEW_UNION = 0;

    /**
     * @param {number} totalNodes
     */
    constructor(totalNodes) {
        //'parent' and 'rank' length = 'totalNodes + 1'
        //value at index 0 is not used since node IDs start from 1.
        this.parent = Array.from(Array(totalNodes + 1).keys());
        this.rank = new Array(totalNodes + 1).fill(0);
        this.groupsOfConnectedComponents = totalNodes;
    }

    /**
     * @param {number} index
     * @return {number}
     */
    findParent(index) {
        if (this.parent[index] !== index) {
            this.parent[index] = this.findParent(this.parent[index]);
        }
        return this.parent[index];
    }

    /**
     * @param {number} first
     * @param {number} second
     * @return {number}
     */
    joinByRank(first, second) {
        first = this.findParent(first);
        second = this.findParent(second);
        if (first === second) {
            return UnionFind.NOT_NEW_UNION;
        }

        --this.groupsOfConnectedComponents;

        if (this.rank[first] >= this.rank[second]) {
            this.parent[second] = first;
            this.rank[first] += this.rank[second];
        } else if (this.rank[second] > this.rank[first]) {
            this.parent[first] = second;
            this.rank[second] += this.rank[first];
        }
        return UnionFind.NEW_UNION;
    }

    /**
     * @return {boolean}
     */
    graphIsFullyTraversable() {
        return this.groupsOfConnectedComponents === 1;
    }
}
