
#include <vector>
using namespace std;

class UnionFind {
    
    static const int NEW_UNION = 1;
    static const int NOT_NEW_UNION = 0;

    vector<int> parent;
    vector<int> rank;
    int groupsOfConnectedComponents;

public:
    explicit UnionFind(int totalNodes) : groupsOfConnectedComponents(totalNodes) {
        //'parent' and 'rank' length = 'totalNodes + 1'
        //value at index 0 is not used since node IDs start from 1.
        parent.resize(totalNodes + 1);
        iota(parent.begin(), parent.end(), 0);
        rank.resize(totalNodes + 1);
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
            return NOT_NEW_UNION;
        }

        --groupsOfConnectedComponents;

        if (rank[first] >= rank[second]) {
            parent[second] = first;
            rank[first] += rank[second];
        } else if (rank[second] > rank[first]) {
            parent[first] = second;
            rank[second] += rank[first];
        }
        return NEW_UNION;
    }

    bool graphIsFullyTraversable() const {
        return groupsOfConnectedComponents == 1;
    }
};

class Solution {
    
    static const int GRAPH_IS_NOT_FULLY_TRAVERSABLE = -1;
    static const int EDGE_FOR_ALICE = 1;
    static const int EDGE_FOR_BOB = 2;
    static const int EDGE_FOR_BOTH_ALICE_AND_BOB = 3;

public:
    int maxNumEdgesToRemove(int totalNodes, const vector<vector<int>>& edges) const {
        UnionFind unionFindAlice(totalNodes);
        UnionFind unionFindBob(totalNodes);

        int minNumberOfEgesForFullyTraversableGraph
                = minNumberOfEdgesPerTypeOfEdge(EDGE_FOR_BOTH_ALICE_AND_BOB, unionFindAlice, unionFindBob, edges)
                + minNumberOfEdgesPerTypeOfEdge(EDGE_FOR_ALICE, unionFindAlice, edges)
                + minNumberOfEdgesPerTypeOfEdge(EDGE_FOR_BOB, unionFindBob, edges);

        return (unionFindAlice.graphIsFullyTraversable() && unionFindBob.graphIsFullyTraversable())
                ? edges.size() - minNumberOfEgesForFullyTraversableGraph
                : GRAPH_IS_NOT_FULLY_TRAVERSABLE;
    }

private:
    int minNumberOfEdgesPerTypeOfEdge(int edgeType, UnionFind& unionFindAlice, UnionFind& unionFindBob, const vector<vector<int>>& edges) const {
        int minNumberOfEdges = 0;
        for (const auto& edge : edges) {
            if (edge[0] == edgeType) {
                minNumberOfEdges += unionFindAlice.joinByRank(edge[1], edge[2]) & unionFindBob.joinByRank(edge[1], edge[2]);
            }
        }
        return minNumberOfEdges;
    }

    int minNumberOfEdgesPerTypeOfEdge(int edgeType, UnionFind& unionFind, const vector<vector<int>>& edges) const {
        int minNumberOfEdges = 0;
        for (const auto& edge : edges) {
            if (edge[0] == edgeType) {
                minNumberOfEdges += unionFind.joinByRank(edge[1], edge[2]);
            }
        }
        return minNumberOfEdges;
    }
};
