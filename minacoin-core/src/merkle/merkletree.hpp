#ifndef __MERKLE_TREE_H__
#define __MERKLE_TREE_H__

#include "../inc.h"
#include <list>

namespace minacoin::merkle {
    template <typename T, char* (hashFunc)(const T&), size_t hashLen>
    class MerkleNodeBase {
        protected: 
            std::unique_ptr<const MerkleNodeBase> _left;
            std::unique_ptr<const MerkleNodeBase> _right;
            const char* _hash;
            const std::shared_ptr<T> _value;
            
        public: 
            size_t length() const { return hashLen; }
            const char* hash() const { return _hash; }
            bool hasChildren() const { return _left || _right; }
            const MerkleNodeBase* left() const { return _left.get(); }
            const MerkleNodeBase* right() const { return _right.get(); }
            
        public: 
            MerkleNodeBase(const T& value) : 
                    _value(new T(value)), 
                    _left(nullptr),
                    _right(nullptr) {
                _hash = hashFunc(value);                                
            }
            
            MerkleNodeBase(const MerkleNodeBase* left, const MerkleNodeBase* right) : 
                    _left(left), 
                    _right(right),
                    _value(nullptr) { }
                    
            ~MerkleNodeBase() {
                if (_hash) delete[](_hash);
            }
            
        public: 
            virtual bool validate() const {
                if (_left && !_left->validate()) {
                    return false;
                }
                if (_right && !_right->validate()) {
                    return false;
                }
                
                std::unique_ptr<const char> computedHash(
                    hasChildren() ? 
                    this->computeHash() : 
                    hashFunc(*_value));
                
                return memcmp(this->_hash, computedHash.get(), this->length()) == 0;
            }
            
        protected: 
            virtual const char* computeHash() const __abstract_method__;
    }; 
    
    
    
    template <typename NodeType> 
    const NodeType* _build(NodeType* nodes[], size_t len) {
        if (len == 1) return new NodeType(nodes[0], nullptr);
        if (len == 2) return new NodeType(nodes[0], nodes[1]);
        
        size_t half = len % 2 == 0 ? len / 2 : len / 2 + 1;
        return new NodeType(build_(nodes, half), build_(nodes + half, len - half));
    }
    
    template <typename T, typename NodeType> 
    const NodeType* build(const std::list<T>& values) {
        NodeType *leaves[values.size()];
        int n = 0; 
        for (auto value : values) {
            leaves[n++] = new NodeType(value); 
        }
        
        return build_(leaves, values.size()); 
    }
}

#endif 