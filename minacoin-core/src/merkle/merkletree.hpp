#ifndef __MERKLE_TREE_H__
#define __MERKLE_TREE_H__

#include "../inc.h"
#include "../util/crypto/crypto.h"
#include "../blockchain/iblockdataitem.hpp"
#include <list>

using namespace minacoin::blockchain;

namespace minacoin::merkle {
    class MerkleNode {
        private:
            std::unique_ptr<const MerkleNode> _left;
            std::unique_ptr<const MerkleNode> _right;
            string _hash; 
            const IBlockDataItem* _value; 
        
        public: 
            const MerkleNode* left() const { return _left.get(); }
            const MerkleNode* right() const { return _right.get(); }
            bool hasChildren() const { return _left || _right; }
            string hash() const { return _hash; }
            
        public: 
            MerkleNode(const IBlockDataItem* value) : 
                    _value(value), 
                    _left(nullptr),
                    _right(nullptr) {
                _hash = this->computeHash();
            }
            
            MerkleNode(const MerkleNode* left, const MerkleNode* right) : 
                    _left(left), 
                    _right(right),
                    _value(nullptr) { 
                _hash = this->computeHash();
            }
        
        private: 
            string computeHash() {
                if (_left && !_right) {
                    return _left->hash();
                }
                if (!_left && _right) {
                    return _right->hash();
                }
                if (!_left && !_right) {
                    return this->_value->getHash(); 
                }
                
                return minacoin::util::crypto::hash((_left->hash() + _right->hash()).c_str()); 
            }
    };
    
    class MerkleTree {
        private: 
            string _hash; 
            
        public: 
            string hash() { return _hash; }
            
        public: 
            MerkleTree(std::list<IBlockDataItem*> items) {                
                int n = 0; 
                
                if (items.size() > 0) {
                    unique_ptr<MerkleNode> leaves[items.size()]; 
                    MerkleNode* leafPointers[items.size()];
                    for (auto item : items) {
                        leaves[n] = make_unique<MerkleNode>(item); 
                        leafPointers[n] = leaves[n].get();
                        n++;
                    }
                    
                    auto root = this->buildTree(leafPointers, items.size());
                    _hash = root->hash();
                    delete root;
                }
            }
        
        private: 
            const MerkleNode* buildTree(MerkleNode* nodes[], size_t len) {
                if (len == 1) {
                    return new MerkleNode(nodes[0], nullptr);
                }
                if (len == 2) {
                    return new MerkleNode(nodes[0], nodes[1]);
                }
                
                size_t half = len % 2 == 0 ? len / 2 : len / 2 + 1;
                return new MerkleNode(buildTree(nodes, half), buildTree(nodes + half, len - half));
            }
    };
}

#endif 