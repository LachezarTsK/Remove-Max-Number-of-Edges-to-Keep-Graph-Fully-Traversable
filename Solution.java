
import java.util.stream.IntStream;

public class Solution {

    private static final int GRAPH_IS_NOT_FULLY_TRAVERSABLE = -1;
    private static final int EDGE_FOR_ALICE = 1;
    private static final int EDGE_FOR_BOB = 2;
    private static final int EDGE_FOR_BOTH_ALICE_AND_BOB = 3;

    public int maxNumEdgesToRemove(int totalNodes, int[][] edges) {
        UnionFind unionFindAlice = new UnionFind(totalNodes);
        UnionFind unionFindBob = new UnionFind(totalNodes);

        int minNumberOfEgesForFullyTraversableGraph
                = minNumberOfEdgesPerTypeOfEdge(EDGE_FOR_BOTH_ALICE_AND_BOB, unionFindAlice, unionFindBob, edges)
                + minNumberOfEdgesPerTypeOfEdge(EDGE_FOR_ALICE, unionFindAlice, edges)
                + minNumberOfEdgesPerTypeOfEdge(EDGE_FOR_BOB, unionFindBob, edges);

        return (unionFindAlice.graphIsFullyTraversable() && unionFindBob.graphIsFullyTraversable())
                ? edges.length - minNumberOfEgesForFullyTraversableGraph
                : GRAPH_IS_NOT_FULLY_TRAVERSABLE;
    }

    private int minNumberOfEdgesPerTypeOfEdge(int edgeType, UnionFind unionFindAlice, UnionFind unionFindBob, int[][] edges) {
        int minNumberOfEdges = 0;
        for (int[] edge : edges) {
            if (edge[0] == edgeType) {
                minNumberOfEdges += unionFindAlice.joinByRank(edge[1], edge[2]) & unionFindBob.joinByRank(edge[1], edge[2]);
            }
        }
        return minNumberOfEdges;
    }

    private int minNumberOfEdgesPerTypeOfEdge(int edgeType, UnionFind unionFind, int[][] edges) {
        int minNumberOfEdges = 0;
        for (int[] edge : edges) {
            if (edge[0] == edgeType) {
                minNumberOfEdges += unionFind.joinByRank(edge[1], edge[2]);
            }
        }
        return minNumberOfEdges;
    }
}

class UnionFind {

    int[] parent;
    int[] rank;
    int groupsOfConnectedComponents;

    UnionFind(int totalNodes) {
        //'parent' and 'rank' length = 'totalNodes + 1'
        //value at index 0 is not used since node IDs start from 1.
        parent = IntStream.rangeClosed(0, totalNodes).toArray();
        rank = new int[totalNodes + 1];
        groupsOfConnectedComponents = totalNodes;
    }

    int findParent(int index) {
        if (parent[index] != index) {
            parent[index] = findParent(parent[index]);
        }
        return parent[index];
    }

    int joinByRank(int first, int second) {
        first = findParent(first);
        second = findParent(second);
        if (first == second) {
            return 0;
        }

        --groupsOfConnectedComponents;

        if (rank[first] >= rank[second]) {
            parent[second] = first;
            rank[first] += rank[second];
        } else if (rank[second] > rank[first]) {
            parent[first] = second;
            rank[second] += rank[first];
        }
        return 1;
    }

    boolean graphIsFullyTraversable() {
        return groupsOfConnectedComponents == 1;
    }
}
