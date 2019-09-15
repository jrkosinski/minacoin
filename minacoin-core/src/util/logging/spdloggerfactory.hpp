#ifndef __SPDLOGGER_FACTORY_H__
#define __SPDLOGGER_FACTORY_H__

#include "../../inc.h"
#include "ilogger.hpp"
#include "spdlogger.hpp"
#include "iloggerfactory.hpp"

namespace minacoin::util::logging {
    class SpdLoggerFactory: public ILoggerFactory {
        public: 
            std::shared_ptr<ILogger> createLogger() override {
                return SpdLoggerFactory::createLogger(""); 
            }
            
            std::shared_ptr<ILogger> createLogger(const std::string& tag) override {
                std::shared_ptr<ILogger> output(new SpdLogger(tag)); 
                return output; 
            }
    }; 
}

#endif 
