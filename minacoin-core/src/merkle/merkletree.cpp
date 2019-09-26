#include "merkletree.hpp"
#include "../util/crypto/crypto.h"

namespace minacoin::merkle {
    MerkleNode::MerkleNode(const IBlockDataItem* value) { 
        _left = nullptr;
        _right = nullptr;        
        _hash = this->computeHash(value);
    }
            
    MerkleNode::MerkleNode(const MerkleNode* left, const MerkleNode* right) {
        _left = left;
        _right = right; 
        _hash = this->computeHash(nullptr);
    }
            
    MerkleNode::~MerkleNode() {
        if (_left) delete _left; 
        if (_right) delete _right; 
    }
        
    string MerkleNode::computeHash(const IBlockDataItem* value) const {
        if (_left && !_right) {
            return _left->hash();
        }
        if (!_left && _right) {
            return _right->hash();
        }
        if (value) {
            return value->getHash(); 
        }
                
        return minacoin::util::crypto::hash((_left->hash() + _right->hash()).c_str()); 
    }
    
    MerkleTree::MerkleTree(const std::vector<IBlockDataItem*>& items) {                
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
    
    bool MerkleTree::containsItem(const IBlockDataItem* item) const {
        if (!item) return false;
        return this->containsItem(item->getHash()); 
    }
    
    bool MerkleTree::containsItem(const string& hash) const {
        //TODO: implement this 
    }
        
    MerkleNode* MerkleTree::buildTree(MerkleNode* nodes[], size_t len) const {
        if (len == 1) {
            return new MerkleNode(nodes[0], nullptr);
        }
        if (len == 2) {
            return new MerkleNode(nodes[0], nodes[1]);
        }
                
        size_t half = len % 2 == 0 ? len / 2 : len / 2 + 1;
        return new MerkleNode(this->buildTree(nodes, half), this->buildTree(nodes + half, len - half));
    }
}
