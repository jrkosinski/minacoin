#ifndef __IOC_H__
#define __IOC_H__

#include "inc.h"
#include <map>

#include "util/logging/ilogger.hpp"
#include "util/logging/spdlogger.hpp"

namespace minacoin {
    
	/**
	 * Simple IOC container. 
	 */ 
    class IOC {
        private: 
            std::map<std::string, std::shared_ptr<void>> _mapping; 
            std::mutex _mapMutex; 
            
        public: 
            IOC() { }
            
        public: 
            static IOC* instance() {
                static IOC instance; 
                return &instance; 
            }
            
        public: 
            template <class T> 
            static void registerService(std::shared_ptr<T> svc) {
                IOC::instance()->_registerService<T>(svc);
            }
            
            template <class T> 
            static void registerService(const std::string& id, std::shared_ptr<T> svc) {
                IOC::instance()->_registerService<T>(id, svc);
            }
            
            template <class T> 
            static std::shared_ptr<T> resolve() {
                return IOC::instance()->_resolve<T>();
            }
            
            template <class T> 
            static std::shared_ptr<T> resolve(const std::string& id) {
                return IOC::instance()->_resolve<T>(id);
            }
            
        public: 
            template <class T> 
            void _registerService(std::shared_ptr<T> svc) {
                const std::type_info* typeId = &typeid(T); 
                this->_registerService(typeId->name(), svc); 
            }
            
            template <class T> 
            void _registerService(const std::string& id, std::shared_ptr<T> svc) {
                std::lock_guard<std::mutex> lock(this->_mapMutex); 
                auto it = this->_mapping.find(id); 
                if (it == this->_mapping.end()) {
                    this->_mapping[id] = svc; 
                }
            }
            
            template <class T> 
            std::shared_ptr<T> _resolve() {
                const std::type_info* typeId = &typeid(T); 
                return this->_resolve<T>(typeId->name());
            }
            
            template <class T> 
            std::shared_ptr<T> _resolve(const std::string& id) {
                std::lock_guard<std::mutex> lock(this->_mapMutex); 
                auto it = this->_mapping.find(id); 
                
                if (it != this->_mapping.end()) {
                    return std::static_pointer_cast<T>(it->second); 
                }
                
                throw std::runtime_error("unable to locate type in IOC");
            }
    }; 
}

#endif 
