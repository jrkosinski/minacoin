#ifndef __MERKLE_TREE_H__
#define __MERKLE_TREE_H__

#include "../inc.h"
#include "../blockchain/iblockdataitem.hpp"
#include <vector>

using namespace minacoin::blockchain;

namespace minacoin::merkle {
    class MerkleNode {
        private:
            const MerkleNode* _left;
            const MerkleNode* _right;
            string _hash; 
        
        public: 
            const MerkleNode* left() const { return _left; }
            const MerkleNode* right() const { return _right; }
            bool hasChildren() const { return _left || _right; }
            string hash() const { return _hash; }
            
        public: 
            MerkleNode(const IBlockDataItem* value);
            MerkleNode(const MerkleNode* left, const MerkleNode* right);
            ~MerkleNode();
        
        private: 
            string computeHash(const IBlockDataItem* value) const;
    };
    
    
    class MerkleTree {
        private: 
            MerkleNode* _root;
            
        public: 
            string hash() const { return _root ? _root->hash() : ""; }
            
        public: 
            MerkleTree(const std::vector<IBlockDataItem*>& items);
            
        public: 
            bool containsItem(const IBlockDataItem* item) const; 
            bool containsItem(const string& hash) const; 
        
        private: 
            MerkleNode* buildTree(MerkleNode* nodes[], size_t len) const;
    };
}

#endif 