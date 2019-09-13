#ifndef __IOC_H__
#define __IOC_H__

#include <map>
#include <string> 

#include "util/logging/ilogger.hpp"
#include "util/logging/spdlogger.hpp"

namespace minacoin {
    class IocContainer {
        private: 
            std::map<std::string, std::shared_ptr<void>> _mapping; 
            std::mutex _mapMutex; 
            
        public: 
            IocContainer() { }
            
        public: 
            static IocContainer* instance() {
                static IocContainer instance; 
                return &instance; 
            }
            
        public: 
            template <class T> 
            void registerService(std::shared_ptr<T> svc) {
                const std::type_info* typeId = &typeid(T); 
                this->registerService(typeId->name(), svc); 
            }
            
            template <class T> 
            void registerService(const std::string& id, std::shared_ptr<T> svc) {
                std::lock_guard<std::mutex> lock(this->_mapMutex); 
                auto it = this->_mapping.find(id); 
                if (it == this->_mapping.end()) {
                    this->_mapping[id] = svc; 
                }
            }
            
            template <class T> 
            std::shared_ptr<T> resolve() {
                const std::type_info* typeId = &typeid(T); 
                return this->resolve<T>(typeId->name());
            }
            
            template <class T> 
            std::shared_ptr<T> resolve(const std::string& id) {
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
