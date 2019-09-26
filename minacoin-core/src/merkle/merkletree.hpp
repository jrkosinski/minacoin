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
            const MerkleNode* _left;
            const MerkleNode* _right;
            const IBlockDataItem* _value; 
            string _hash; 
        
        public: 
            const MerkleNode* left() const { return _left; }
            const MerkleNode* right() const { return _right; }
            bool hasChildren() const { return _left || _right; }
            string hash() const { return _hash; }
            
        public: 
            MerkleNode(const IBlockDataItem* value) : 
                    _left(nullptr),
                    _right(nullptr), 
                    _value(value) {
                _hash = this->computeHash();
            }
            
            MerkleNode(const MerkleNode* left, const MerkleNode* right) : 
                    _left(left), 
                    _right(right),
                    _value(nullptr) { 
                _hash = this->computeHash();
            }
            ~MerkleNode() {
                if (_left) delete _left; 
                if (_right) delete _right; 
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
            MerkleNode* _root;
            
        public: 
            string hash() { return _root ? _root->hash() : ""; }
            
        public: 
            MerkleTree(std::list<IBlockDataItem*> items) {                
                int n = 0; 
                
                if (items.size() > 0) {
                    MerkleNode* nodes[items.size()];
                    for (auto item : items) {
                        nodes[n] = new MerkleNode(item);
                        n++;
                    }
                    
                    _root = this->buildTree(nodes, items.size());
                }
                else {
                    _root = nullptr;
                }
            }
        
        private: 
            MerkleNode* buildTree(MerkleNode* nodes[], size_t len) {
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